import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize folders
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'iydani-super-secret-key-2026';

app.use(cors());
app.use(express.json());

// MongoDB connection pooling (serverless-friendly)
let cachedClient = null;
let cachedDb = null;
let isSeeded = false;

async function getDb() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is missing. Please configure it in your MongoDB Atlas / Vercel settings.');
  }
  if (cachedDb) {
    return cachedDb;
  }
  if (!cachedClient) {
    console.log('[INFO] Connecting to MongoDB...');
    cachedClient = new MongoClient(mongoUri);
    await cachedClient.connect();
    console.log('[INFO] MongoDB connected successfully.');
  }
  cachedDb = cachedClient.db();
  await seedDatabase(cachedDb);
  return cachedDb;
}

// Helper to seed database from db.json if collections are empty
async function seedDatabase(dbInstance) {
  if (isSeeded) return;
  try {
    const adminCol = dbInstance.collection('admin_credentials');
    const adminCount = await adminCol.countDocuments();
    if (adminCount > 0) {
      isSeeded = true;
      return;
    }

    const dbJsonPath = path.join(process.cwd(), 'db.json');
    let dbData = null;
    if (fs.existsSync(dbJsonPath)) {
      dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));
    } else {
      console.warn('[WARNING] db.json not found at process.cwd(), using fallback admin seed.');
    }

    // 1. Seed admin credentials
    let email = 'admin@iydani.com';
    let passwordHash = '$2b$10$FNFl8mtoGM8XPZe73RDt1e.xxT0e.bSNYHOYVOOheUPrUvwPOCNfS'; // hash of admin123
    if (dbData && dbData['admin:credentials']) {
      email = dbData['admin:credentials'].email || email;
      passwordHash = dbData['admin:credentials'].passwordHash || passwordHash;
    }
    await adminCol.insertOne({
      email: email,
      password_hash: passwordHash
    });
    console.log('[SEED] Seeded admin_credentials collection.');

    // If db.json doesn't exist, we can't seed the rest, but we keep isSeeded false so it retries if db.json appears (or true to prevent logging spam)
    if (!dbData) {
      isSeeded = true;
      return;
    }

    // 2. Seed site settings
    const settingsCol = dbInstance.collection('site_settings');
    const settingsCount = await settingsCol.countDocuments();
    if (settingsCount === 0 && dbData['site:settings']) {
      const s = dbData['site:settings'];
      await settingsCol.insertOne({
        id: 1,
        logo_text: s.logoText,
        tagline: s.tagline,
        description: s.description,
        email: s.email,
        phone: s.phone,
        address: s.address,
        youtube_url: s.youtubeUrl,
        instagram_url: s.instagramUrl,
        linkedin_url: s.linkedinUrl,
        whatsapp_url: s.whatsappUrl,
        bg_video_url: s.bgVideoUrl,
        about_text1: s.aboutText1,
        about_text2: s.aboutText2,
        about_image: s.aboutImage,
        team: s.team || [],
        entertainment_services: s.entertainmentServices || [],
        studio_services: s.studioServices || [],
        faq_items: s.faqItems || [],
        catalog_services: s.catalogServices || [],
        seo_overrides: s.seoOverrides || {}
      });
      console.log('[SEED] Seeded site_settings collection.');
    }

    // 3. Seed privacy policy
    const privacyCol = dbInstance.collection('privacy_policy');
    const privacyCount = await privacyCol.countDocuments();
    if (privacyCount === 0 && dbData['privacy-policy']) {
      await privacyCol.insertOne({
        id: 1,
        policy: dbData['privacy-policy']
      });
      console.log('[SEED] Seeded privacy_policy collection.');
    }

    // 4. Seed news
    const newsCol = dbInstance.collection('news');
    const newsCount = await newsCol.countDocuments();
    if (newsCount === 0 && Array.isArray(dbData['news']) && dbData['news'].length > 0) {
      const seededNews = dbData['news'].map(item => ({
        ...item,
        created_at: item.created_at || new Date().toISOString()
      }));
      await newsCol.insertMany(seededNews);
      console.log('[SEED] Seeded news collection.');
    }

    // 5. Seed releases
    const releasesCol = dbInstance.collection('releases');
    const releasesCount = await releasesCol.countDocuments();
    if (releasesCount === 0 && Array.isArray(dbData['releases']) && dbData['releases'].length > 0) {
      const seededReleases = dbData['releases'].map(item => ({
        title: item.title,
        artist: item.artist,
        genre: item.genre,
        image: item.image,
        release_date: item.releaseDate || item.release_date
      }));
      await releasesCol.insertMany(seededReleases);
      console.log('[SEED] Seeded releases collection.');
    }

    // 6. Seed jobs
    const jobsCol = dbInstance.collection('jobs');
    const jobsCount = await jobsCol.countDocuments();
    if (jobsCount === 0 && Array.isArray(dbData['jobs']) && dbData['jobs'].length > 0) {
      await jobsCol.insertMany(dbData['jobs']);
      console.log('[SEED] Seeded jobs collection.');
    }

    // 7. Submissions
    const contactCol = dbInstance.collection('submissions_contact');
    const contactCount = await contactCol.countDocuments();
    if (contactCount === 0 && Array.isArray(dbData['submissions:contact']) && dbData['submissions:contact'].length > 0) {
      await contactCol.insertMany(dbData['submissions:contact']);
      console.log('[SEED] Seeded submissions_contact collection.');
    }

    const careerCol = dbInstance.collection('submissions_career');
    const careerCount = await careerCol.countDocuments();
    if (careerCount === 0 && Array.isArray(dbData['submissions:career']) && dbData['submissions:career'].length > 0) {
      await careerCol.insertMany(dbData['submissions:career']);
      console.log('[SEED] Seeded submissions_career collection.');
    }

    isSeeded = true;
  } catch (err) {
    console.error('[ERROR] Error seeding MongoDB:', err);
  }
}

// Middleware for admin verification
function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. No token provided.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }
}

// Multer In-Memory configuration for uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Helper to convert dynamic string/ObjectId query
function getQueryById(id) {
  const query = { $or: [{ id: id }] };
  try {
    query.$or.push({ _id: new ObjectId(id) });
  } catch (_) {}
  try {
    query.$or.push({ _id: id });
  } catch (_) {}
  return query;
}

// ──────────────────────────────────────────────────────────────────
// API ROUTES
// ──────────────────────────────────────────────────────────────────

// Home Route / Health check / Navigation Guide
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Iydani Backend Server</title>
      </head>
      <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #FAF9F4; color: #2A2D34; text-align: center;">
        <div>
          <h1 style="font-size: 2.2rem; margin-bottom: 10px; font-weight: 700;">Iydani Backend API Server</h1>
          <p style="font-size: 1.1rem; color: #6C7D7F; margin-bottom: 25px;">The server is running successfully with MongoDB on port ${PORT}.</p>
          <div style="background: white; border: 1px solid rgba(42,45,52,0.1); padding: 25px; border-radius: 16px; max-width: 500px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); margin: 0 auto;">
            <p style="margin: 0 0 10px 0; font-weight: bold; font-size: 1.05rem;">To access the Admin Panel:</p>
            <p style="margin: 0; font-size: 0.95rem; line-height: 1.5; color: #3D4149;">
              Go to the main website at 
              <a href="http://localhost:5173" style="color: #c5a880; font-weight: bold; text-decoration: none;">http://localhost:5173</a> 
              and click the top-left logo <strong>5 times</strong>, or visit 
              <a href="http://localhost:5173/#/admin" style="color: #c5a880; font-weight: bold; text-decoration: none;">http://localhost:5173/#/admin</a> directly.
            </p>
          </div>
        </div>
      </body>
    </html>
  `);
});

// 1. AUTH
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  
  try {
    const db = await getDb();
    const creds = await db.collection('admin_credentials').findOne({ email });

    if (!creds) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    
    const isMatch = bcrypt.compareSync(password, creds.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    
    // Create token
    const token = jwt.sign({ email: creds.email }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { email: creds.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Server error during authentication.' });
  }
});

app.get('/api/auth/me', verifyAdmin, (req, res) => {
  res.json({ authorized: true, email: req.admin.email });
});

// 2. SETTINGS
app.get('/api/settings', async (req, res) => {
  try {
    const db = await getDb();
    const data = await db.collection('site_settings').findOne({ id: 1 });

    if (!data) {
      return res.status(404).json({ error: 'Settings not found.' });
    }

    // Self-healing: Correct any database entries with old spelling or address
    let needsUpdate = false;
    if (data.email === 'info@iyedani.com') {
      data.email = 'info@iydani.com';
      needsUpdate = true;
    }
    if (data.description && data.description.includes('Iyedani')) {
      data.description = data.description.replace(/Iyedani/g, 'Iydani');
      needsUpdate = true;
    }
    if (data.logo_text && data.logo_text.includes('Iyedani')) {
      data.logo_text = data.logo_text.replace(/Iyedani/g, 'Iydani');
      needsUpdate = true;
    }
    if (data.address && data.address.includes('Mahalakshmipuram')) {
      data.address = "LIG 3rd Stage, Udaya Layout, Yelahanka New Town, Bengaluru, Karnataka 560064\nHamsalekha Music School";
      needsUpdate = true;
    }
    if (data.seo_overrides) {
      if (data.seo_overrides.seoEmail === 'info@iyedani.com') {
        data.seo_overrides.seoEmail = 'info@iydani.com';
        needsUpdate = true;
      }
      if (data.seo_overrides.seoAddress && data.seo_overrides.seoAddress.includes('Mahalakshmipuram')) {
        data.seo_overrides.seoAddress = "LIG 3rd Stage, Udaya Layout, Yelahanka New Town, Bengaluru, Karnataka 560064\nHamsalekha Music School";
        needsUpdate = true;
      }
    }
    if (Array.isArray(data.team)) {
      const hamsalekha = data.team.find(m => m.name && m.name.includes('Hamsalekha'));
      if (hamsalekha && (!hamsalekha.image || hamsalekha.image === "")) {
        hamsalekha.image = "/hamsalekha_logo.png";
        needsUpdate = true;
      }
    }
    if (Array.isArray(data.studio_services)) {
      const hasGraphic = data.studio_services.some(s => s.title === 'Graphic Designing');
      if (!hasGraphic) {
        data.studio_services.push({
          title: 'Graphic Designing',
          desc: 'Timeless visual branding, digital illustrations, album arts, and custom layouts tailored for entertainment and media.',
          icon: '🎨'
        });
        needsUpdate = true;
      }
    }
    if (!data.catalog_services || !Array.isArray(data.catalog_services) || data.catalog_services.length < 5) {
      const dbJsonPath = path.join(process.cwd(), 'db.json');
      if (fs.existsSync(dbJsonPath)) {
        try {
          const dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));
          if (dbData['site:settings'] && dbData['site:settings'].catalogServices) {
            data.catalog_services = dbData['site:settings'].catalogServices;
            needsUpdate = true;
          }
        } catch (_) {}
      }
    }

    if (needsUpdate) {
      db.collection('site_settings').replaceOne({ id: 1 }, data, { upsert: true })
        .then(() => console.log('[INFO] Database settings self-healed and updated successfully.'))
        .catch(err => console.error('[ERROR] Self-healing DB update failed:', err));
    }

    const settings = {
      logoText: data.logo_text,
      tagline: data.tagline,
      description: data.description,
      email: data.email,
      phone: data.phone,
      address: data.address,
      youtubeUrl: data.youtube_url,
      instagramUrl: data.instagram_url,
      linkedinUrl: data.linkedin_url,
      whatsappUrl: data.whatsapp_url,
      bgVideoUrl: data.bg_video_url,
      aboutText1: data.about_text1,
      aboutText2: data.about_text2,
      aboutImage: data.about_image,
      team: data.team || [],
      entertainmentServices: data.entertainment_services || [],
      studioServices: data.studio_services || [],
      faqItems: data.faq_items || [],
      catalogServices: data.catalog_services || [],
      seoOverrides: data.seo_overrides || {}
    };
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to retrieve settings.' });
  }
});

app.put('/api/settings', verifyAdmin, async (req, res) => {
  try {
    const db = await getDb();
    await db.collection('site_settings').replaceOne(
      { id: 1 },
      {
        id: 1,
        logo_text: req.body.logoText,
        tagline: req.body.tagline,
        description: req.body.description,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        youtube_url: req.body.youtubeUrl,
        instagram_url: req.body.instagramUrl,
        linkedin_url: req.body.linkedinUrl,
        whatsapp_url: req.body.whatsappUrl,
        bg_video_url: req.body.bgVideoUrl,
        about_text1: req.body.aboutText1,
        about_text2: req.body.aboutText2,
        about_image: req.body.aboutImage,
        team: req.body.team || [],
        entertainment_services: req.body.entertainmentServices || [],
        studio_services: req.body.studioServices || [],
        faq_items: req.body.faqItems || [],
        catalog_services: req.body.catalogServices || [],
        seo_overrides: req.body.seoOverrides || {}
      },
      { upsert: true }
    );

    res.json({ success: true, message: 'Settings updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to save settings.' });
  }
});

app.post('/api/auth/change-password', verifyAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both passwords are required.' });
  }
  try {
    const db = await getDb();
    const creds = await db.collection('admin_credentials').findOne({ email: req.admin.email });

    if (!creds) {
      return res.status(404).json({ error: 'Admin account not found.' });
    }

    const isMatch = bcrypt.compareSync(currentPassword, creds.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password.' });
    }
    
    const salt = bcrypt.genSaltSync(10);
    const newPasswordHash = bcrypt.hashSync(newPassword, salt);
    
    await db.collection('admin_credentials').updateOne(
      { email: req.admin.email },
      { $set: { password_hash: newPasswordHash } }
    );

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to update password.' });
  }
});

// 3. FILE UPLOADS (Save locally)
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(req.file.originalname);
    const fileName = 'file-' + uniqueSuffix + ext;

    // Write file locally
    const destPath = path.join(uploadsDir, fileName);
    fs.writeFileSync(destPath, req.file.buffer);

    res.json({ url: `/uploads/${fileName}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process file upload.' });
  }
});

// 4. SUBMISSIONS (Contact & Careers)
app.post('/api/submissions/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  try {
    const db = await getDb();
    await db.collection('submissions_contact').insertOne({
      name,
      email,
      message,
      created_at: new Date().toISOString()
    });
    res.json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to submit contact form.' });
  }
});

app.get('/api/submissions/contact', verifyAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const data = await db.collection('submissions_contact')
      .find()
      .sort({ created_at: -1 })
      .toArray();

    const mapped = (data || []).map(item => ({
      id: item._id.toString(),
      name: item.name,
      email: item.email,
      message: item.message,
      createdAt: item.created_at
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to fetch contact submissions.' });
  }
});

app.post('/api/submissions/career', async (req, res) => {
  const { name, email, jobTitle, resumeUrl, coverLetter } = req.body;
  if (!name || !email || !jobTitle) {
    return res.status(400).json({ error: 'Name, email, and job title are required.' });
  }
  try {
    const db = await getDb();
    await db.collection('submissions_career').insertOne({
      name,
      email,
      job_title: jobTitle,
      resume_url: resumeUrl || '',
      cover_letter: coverLetter || '',
      created_at: new Date().toISOString()
    });
    res.json({ success: true, message: 'Application submitted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to submit career application.' });
  }
});

app.get('/api/submissions/career', verifyAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const data = await db.collection('submissions_career')
      .find()
      .sort({ created_at: -1 })
      .toArray();

    const mapped = (data || []).map(item => ({
      id: item._id.toString(),
      name: item.name,
      email: item.email,
      jobTitle: item.job_title,
      resumeUrl: item.resume_url,
      coverLetter: item.cover_letter,
      createdAt: item.created_at
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to fetch career applications.' });
  }
});

app.delete('/api/submissions/career/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    await db.collection('submissions_career').deleteOne(getQueryById(id));
    res.json({ success: true, message: 'Application deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to delete application.' });
  }
});

app.delete('/api/submissions/contact/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    await db.collection('submissions_contact').deleteOne(getQueryById(id));
    res.json({ success: true, message: 'Inquiry deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to delete contact inquiry.' });
  }
});

// 5. PRIVACY POLICY
app.get('/api/privacy-policy', async (req, res) => {
  try {
    const db = await getDb();
    const data = await db.collection('privacy_policy').findOne({ id: 1 });
    res.json({ policy: data ? data.policy : '' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to load privacy policy.' });
  }
});

app.put('/api/privacy-policy', verifyAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const { policy } = req.body;
    await db.collection('privacy_policy').replaceOne(
      { id: 1 },
      { id: 1, policy },
      { upsert: true }
    );
    res.json({ success: true, message: 'Privacy policy updated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to save privacy policy.' });
  }
});

// 6. NEWS
app.get('/api/news', async (req, res) => {
  try {
    const db = await getDb();
    const data = await db.collection('news')
      .find()
      .sort({ created_at: -1 })
      .toArray();

    const mapped = (data || []).map(item => ({
      id: item._id ? item._id.toString() : item.id,
      title: item.title,
      summary: item.summary,
      content: item.content,
      image: item.image,
      category: item.category,
      created_at: item.created_at
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to fetch news.' });
  }
});

app.post('/api/news', verifyAdmin, async (req, res) => {
  const { title, summary, content, image, category } = req.body;
  try {
    const db = await getDb();
    const doc = {
      title,
      summary,
      content,
      image: image || '',
      category: category || 'Announcement',
      created_at: new Date().toISOString()
    };
    const result = await db.collection('news').insertOne(doc);
    res.json({
      id: result.insertedId.toString(),
      ...doc
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to create news article.' });
  }
});

app.delete('/api/news/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    await db.collection('news').deleteOne(getQueryById(id));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to delete news article.' });
  }
});

// 7. RELEASES (Audio Label releases)
app.get('/api/releases', async (req, res) => {
  try {
    const db = await getDb();
    const data = await db.collection('releases').find().toArray();

    const mapped = (data || []).map(item => ({
      id: item._id ? item._id.toString() : item.id,
      title: item.title,
      artist: item.artist,
      genre: item.genre,
      image: item.image,
      releaseDate: item.release_date || item.releaseDate
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to fetch releases.' });
  }
});

app.post('/api/releases', verifyAdmin, async (req, res) => {
  const { title, artist, genre, image, releaseDate } = req.body;
  try {
    const db = await getDb();
    const doc = {
      title,
      artist,
      genre: genre || 'Soundtrack',
      image: image || '',
      release_date: releaseDate || new Date().toISOString().split('T')[0]
    };
    const result = await db.collection('releases').insertOne(doc);
    res.json({
      id: result.insertedId.toString(),
      title: doc.title,
      artist: doc.artist,
      genre: doc.genre,
      image: doc.image,
      releaseDate: doc.release_date
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to create release.' });
  }
});

app.delete('/api/releases/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    await db.collection('releases').deleteOne(getQueryById(id));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to delete release.' });
  }
});

// 8. CAREERS JOBS LIST
app.get('/api/jobs', async (req, res) => {
  try {
    const db = await getDb();
    const data = await db.collection('jobs').find().toArray();
    const mapped = (data || []).map(item => ({
      id: item._id ? item._id.toString() : item.id,
      title: item.title,
      department: item.department,
      type: item.type,
      location: item.location,
      description: item.description
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to fetch jobs.' });
  }
});

app.post('/api/jobs', verifyAdmin, async (req, res) => {
  const { title, department, type, location, description } = req.body;
  try {
    const db = await getDb();
    const doc = {
      title,
      department: department || 'Production',
      type: type || 'Full-time',
      location: location || 'Bengaluru',
      description
    };
    const result = await db.collection('jobs').insertOne(doc);
    res.json({
      id: result.insertedId.toString(),
      ...doc
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to create job opening.' });
  }
});

app.delete('/api/jobs/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    await db.collection('jobs').deleteOne(getQueryById(id));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to delete job opening.' });
  }
});

// Serve local upload files statically
app.use('/uploads', express.static(uploadsDir));

// Export app default for Vercel
export default app;

// Start server locally if run directly
if (process.env.NODE_ENV !== 'production' && path.basename(process.argv[1]) === 'server.js') {
  app.listen(PORT, () => {
    console.log(`[INFO] Backend API server is running with MongoDB on http://localhost:${PORT}`);
  });
}
