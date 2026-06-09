import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Redis } from '@upstash/redis';

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
const JWT_SECRET = process.env.JWT_SECRET || 'iyedani-super-secret-key-2026';

app.use(cors());
app.use(express.json());

// Set up local fallback database path
const dbPath = path.join(__dirname, 'db.json');

// Helper to initialize local DB with default values
function initLocalDb() {
  if (!fs.existsSync(dbPath)) {
    const salt = bcrypt.genSaltSync(10);
    const defaultPasswordHash = bcrypt.hashSync('admin123', salt);
    
    const initialData = {
      'admin:credentials': {
        email: 'admin@iyedani.com',
        passwordHash: defaultPasswordHash
      },
      'site:settings': {
        logoText: 'IYDANI ENTERTAINMENT',
        tagline: 'Sound, Vision & Immersive Spaces',
        description: 'Pioneering next-generation audio production, high-end commercial visuals, and virtual VFX cyclorama experiences.',
        email: 'info@iyedani.com',
        phone: '+91 74115 44427',
        address: '2nd Floor, 1092/93, 10th C Cross, 11th Main Rd, Stage 2, Mahalakshmipuram, Bengaluru, Karnataka 560086',
        youtubeUrl: 'https://www.youtube.com/@Iydani_Entertainment',
        instagramUrl: 'https://www.instagram.com/iydanientertainment/',
        linkedinUrl: 'https://in.linkedin.com/company/iydani-entertainment',
        whatsappUrl: 'https://wa.me/9107411544427',
        bgVideoUrl: 'https://www.youtube.com/embed/Vz36RkM-rX8?autoplay=1&mute=1&loop=1&playlist=Vz36RkM-rX8&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1'
      },
      'privacy-policy': '# Privacy Policy\n\nLast updated: June 09, 2026\n\nWe value your privacy. Your contact and career application submissions are securely stored and processed in compliance with modern data security practices. We do not sell or share your personal data with third parties.',
      'news': [],
      'releases': [],
      'jobs': [
        { id: '1', title: 'Senior Audio Engineer', department: 'Studios', type: 'Full-time', location: 'Bengaluru', description: 'Seeking a veteran recording & mixing engineer experienced with high-end analog paths.' },
        { id: '2', title: 'VFX Compositor', department: 'Visual Production', type: 'Full-time', location: 'Bengaluru', description: 'Experienced in green screen keying, camera tracking, and Blender/Nuke.' }
      ],
      'submissions:contact': [],
      'submissions:career': []
    };
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
  }
}
initLocalDb();

// Setup KV Database Client (Upstash Redis with local file fallback)
const isRedisConfigured = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
let redis = null;
if (isRedisConfigured) {
  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    console.log('[INFO] Upstash Redis connected successfully.');
  } catch (err) {
    console.error('[ERROR] Failed to initialize Upstash Redis client. Falling back to local db.json.', err);
  }
} else {
  console.log('[INFO] Upstash Redis not configured. Using local db.json database.');
}

// Database helper functions
async function dbGet(key) {
  if (redis) {
    const val = await redis.get(key);
    return val;
  } else {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    return data[key] || null;
  }
}

async function dbSet(key, val) {
  if (redis) {
    await redis.set(key, val);
  } else {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    data[key] = val;
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  }
}

// Seed admin credentials if not set in Upstash
async function seedRedis() {
  if (redis) {
    const exists = await redis.get('admin:credentials');
    if (!exists) {
      const salt = bcrypt.genSaltSync(10);
      const defaultPasswordHash = bcrypt.hashSync('admin123', salt);
      await redis.set('admin:credentials', {
        email: 'admin@iyedani.com',
        passwordHash: defaultPasswordHash
      });
      // Set settings defaults
      const localData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      await redis.set('site:settings', localData['site:settings']);
      await redis.set('privacy-policy', localData['privacy-policy']);
      await redis.set('jobs', localData['jobs']);
      await redis.set('news', []);
      await redis.set('releases', []);
      await redis.set('submissions:contact', []);
      await redis.set('submissions:career', []);
      console.log('[INFO] Seeded Upstash Redis with default admin credentials & settings.');
    }
  }
}
seedRedis().catch(console.error);

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

// Multer Local Upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'file-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// ──────────────────────────────────────────────────────────────────
// API ROUTES
// ──────────────────────────────────────────────────────────────────

// 1. AUTH
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  
  try {
    const creds = await dbGet('admin:credentials');
    if (!creds || creds.email !== email) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    
    const isMatch = bcrypt.compareSync(password, creds.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    
    // Create token
    const token = jwt.sign({ email: creds.email }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { email: creds.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error during authentication.' });
  }
});

app.get('/api/auth/me', verifyAdmin, (req, res) => {
  res.json({ authorized: true, email: req.admin.email });
});

// 2. SETTINGS
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await dbGet('site:settings');
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve settings.' });
  }
});

app.put('/api/settings', verifyAdmin, async (req, res) => {
  try {
    await dbSet('site:settings', req.body);
    res.json({ success: true, message: 'Settings updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings.' });
  }
});

app.post('/api/auth/change-password', verifyAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both passwords are required.' });
  }
  try {
    const creds = await dbGet('admin:credentials');
    const isMatch = bcrypt.compareSync(currentPassword, creds.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password.' });
    }
    
    const salt = bcrypt.genSaltSync(10);
    creds.passwordHash = bcrypt.hashSync(newPassword, salt);
    await dbSet('admin:credentials', creds);
    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update password.' });
  }
});

// 3. FILE UPLOADS
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  const relativePath = `/uploads/${req.file.filename}`;
  res.json({ url: relativePath });
});

// 4. SUBMISSIONS (Contact & Careers)
app.post('/api/submissions/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  try {
    const subs = await dbGet('submissions:contact') || [];
    const newSub = {
      id: Date.now().toString(),
      name,
      email,
      message,
      createdAt: new Date().toISOString()
    };
    subs.unshift(newSub);
    await dbSet('submissions:contact', subs);
    res.json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit contact form.' });
  }
});

app.get('/api/submissions/contact', verifyAdmin, async (req, res) => {
  try {
    const subs = await dbGet('submissions:contact') || [];
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contact submissions.' });
  }
});

app.post('/api/submissions/career', async (req, res) => {
  const { name, email, jobTitle, resumeUrl, coverLetter } = req.body;
  if (!name || !email || !jobTitle) {
    return res.status(400).json({ error: 'Name, email, and job title are required.' });
  }
  try {
    const subs = await dbGet('submissions:career') || [];
    const newSub = {
      id: Date.now().toString(),
      name,
      email,
      jobTitle,
      resumeUrl: resumeUrl || '',
      coverLetter: coverLetter || '',
      createdAt: new Date().toISOString()
    };
    subs.unshift(newSub);
    await dbSet('submissions:career', subs);
    res.json({ success: true, message: 'Application submitted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit career application.' });
  }
});

app.get('/api/submissions/career', verifyAdmin, async (req, res) => {
  try {
    const subs = await dbGet('submissions:career') || [];
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch career applications.' });
  }
});

// 5. PRIVACY POLICY
app.get('/api/privacy-policy', async (req, res) => {
  try {
    const policy = await dbGet('privacy-policy') || '';
    res.json({ policy });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load privacy policy.' });
  }
});

app.put('/api/privacy-policy', verifyAdmin, async (req, res) => {
  try {
    await dbSet('privacy-policy', req.body.policy);
    res.json({ success: true, message: 'Privacy policy updated.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save privacy policy.' });
  }
});

// 6. NEWS
app.get('/api/news', async (req, res) => {
  try {
    const news = await dbGet('news') || [];
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news.' });
  }
});

app.post('/api/news', verifyAdmin, async (req, res) => {
  try {
    const news = await dbGet('news') || [];
    const newItem = {
      id: Date.now().toString(),
      title: req.body.title,
      summary: req.body.summary,
      content: req.body.content,
      image: req.body.image || '',
      category: req.body.category || 'Announcement',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };
    news.unshift(newItem);
    await dbSet('news', news);
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create news article.' });
  }
});

app.delete('/api/news/:id', verifyAdmin, async (req, res) => {
  try {
    let news = await dbGet('news') || [];
    news = news.filter(item => item.id !== req.params.id);
    await dbSet('news', news);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete news article.' });
  }
});

// 7. RELEASES (Audio Label releases)
app.get('/api/releases', async (req, res) => {
  try {
    const releases = await dbGet('releases') || [];
    res.json(releases);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch releases.' });
  }
});

app.post('/api/releases', verifyAdmin, async (req, res) => {
  try {
    const releases = await dbGet('releases') || [];
    const newRelease = {
      id: Date.now().toString(),
      title: req.body.title,
      artist: req.body.artist,
      genre: req.body.genre || 'Soundtrack',
      image: req.body.image || '',
      releaseDate: req.body.releaseDate || new Date().toISOString().split('T')[0]
    };
    releases.unshift(newRelease);
    await dbSet('releases', releases);
    res.json(newRelease);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create release.' });
  }
});

app.delete('/api/releases/:id', verifyAdmin, async (req, res) => {
  try {
    let releases = await dbGet('releases') || [];
    releases = releases.filter(item => item.id !== req.params.id);
    await dbSet('releases', releases);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete release.' });
  }
});

// 8. CAREERS JOBS LIST
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await dbGet('jobs') || [];
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs.' });
  }
});

app.post('/api/jobs', verifyAdmin, async (req, res) => {
  try {
    const jobs = await dbGet('jobs') || [];
    const newJob = {
      id: Date.now().toString(),
      title: req.body.title,
      department: req.body.department || 'Production',
      type: req.body.type || 'Full-time',
      location: req.body.location || 'Bengaluru',
      description: req.body.description
    };
    jobs.unshift(newJob);
    await dbSet('jobs', jobs);
    res.json(newJob);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create job opening.' });
  }
});

app.delete('/api/jobs/:id', verifyAdmin, async (req, res) => {
  try {
    let jobs = await dbGet('jobs') || [];
    jobs = jobs.filter(item => item.id !== req.params.id);
    await dbSet('jobs', jobs);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete job opening.' });
  }
});

// Serve local upload files statically
app.use('/uploads', express.static(uploadsDir));

// Export app default for Vercel
export default app;

// Start server locally if run directly
if (process.env.NODE_ENV !== 'production' && path.basename(process.argv[1]) === 'server.js') {
  app.listen(PORT, () => {
    console.log(`[INFO] Backend API server is running on http://localhost:${PORT}`);
  });
}
