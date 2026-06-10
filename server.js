import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

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

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('[WARNING] Supabase credentials (SUPABASE_URL, SUPABASE_KEY / SUPABASE_SERVICE_ROLE_KEY) are missing in environment!');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

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

// Multer In-Memory configuration for Supabase Storage uploads (Vercel-compatible)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

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
          <p style="font-size: 1.1rem; color: #6C7D7F; margin-bottom: 25px;">The server is running successfully on port ${PORT}.</p>
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
    const { data: creds, error } = await supabase
      .from('admin_credentials')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !creds) {
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
    return res.status(500).json({ error: 'Server error during authentication.' });
  }
});

app.get('/api/auth/me', verifyAdmin, (req, res) => {
  res.json({ authorized: true, email: req.admin.email });
});

// 2. SETTINGS
app.get('/api/settings', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Settings not found.' });
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
      studioServices: data.studio_services || []
    };
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve settings.' });
  }
});

app.put('/api/settings', verifyAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('site_settings')
      .update({
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
        studio_services: req.body.studioServices || []
      })
      .eq('id', 1);

    if (error) throw error;
    res.json({ success: true, message: 'Settings updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save settings.' });
  }
});

app.post('/api/auth/change-password', verifyAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both passwords are required.' });
  }
  try {
    const { data: creds, error: fetchErr } = await supabase
      .from('admin_credentials')
      .select('*')
      .eq('email', req.admin.email)
      .single();

    if (fetchErr || !creds) {
      return res.status(404).json({ error: 'Admin account not found.' });
    }

    const isMatch = bcrypt.compareSync(currentPassword, creds.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password.' });
    }
    
    const salt = bcrypt.genSaltSync(10);
    const newPasswordHash = bcrypt.hashSync(newPassword, salt);
    
    const { error: updateErr } = await supabase
      .from('admin_credentials')
      .update({ password_hash: newPasswordHash })
      .eq('email', req.admin.email);

    if (updateErr) throw updateErr;

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update password.' });
  }
});

// 3. FILE UPLOADS
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(req.file.originalname);
    const fileName = 'file-' + uniqueSuffix + ext;

    // Upload to Supabase Storage bucket 'uploads'
    let uploadResult = await supabase.storage
      .from('uploads')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    // If bucket not found, try to create it programmatically
    if (uploadResult.error && (
      uploadResult.error.message?.toLowerCase().includes('not found') || 
      uploadResult.error.error?.toLowerCase().includes('not found') ||
      uploadResult.error.statusCode === '404' ||
      uploadResult.error.statusCode === 404 ||
      uploadResult.error.status === 404
    )) {
      console.log('[INFO] Bucket "uploads" not found. Creating it programmatically...');
      const { error: createError } = await supabase.storage.createBucket('uploads', {
        public: true
      });

      if (createError) {
        console.error('[ERROR] Failed to create bucket programmatically:', createError);
        return res.status(500).json({ error: 'Storage bucket not configured and auto-creation failed.' });
      }

      // Retry upload
      uploadResult = await supabase.storage
        .from('uploads')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          cacheControl: '3600',
          upsert: false
        });
    }

    if (uploadResult.error) {
      console.error('[ERROR] Supabase Storage upload failed:', uploadResult.error);
      return res.status(500).json({ error: 'Failed to upload file to storage bucket.' });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(fileName);

    res.json({ url: publicUrl });
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
    const { error } = await supabase
      .from('submissions_contact')
      .insert([{ name, email, message }]);

    if (error) throw error;
    res.json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit contact form.' });
  }
});

app.get('/api/submissions/contact', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('submissions_contact')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const mapped = (data || []).map(item => ({
      id: item.id,
      name: item.name,
      email: item.email,
      message: item.message,
      createdAt: item.created_at
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch contact submissions.' });
  }
});

app.post('/api/submissions/career', async (req, res) => {
  const { name, email, jobTitle, resumeUrl, coverLetter } = req.body;
  if (!name || !email || !jobTitle) {
    return res.status(400).json({ error: 'Name, email, and job title are required.' });
  }
  try {
    const { error } = await supabase
      .from('submissions_career')
      .insert([{
        name,
        email,
        job_title: jobTitle,
        resume_url: resumeUrl || '',
        cover_letter: coverLetter || ''
      }]);

    if (error) throw error;
    res.json({ success: true, message: 'Application submitted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit career application.' });
  }
});

app.get('/api/submissions/career', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('submissions_career')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const mapped = (data || []).map(item => ({
      id: item.id,
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
    res.status(500).json({ error: 'Failed to fetch career applications.' });
  }
});

app.delete('/api/submissions/career/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('submissions_career')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Application deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete application.' });
  }
});

app.delete('/api/submissions/contact/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('submissions_contact')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Inquiry deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete contact inquiry.' });
  }
});

// 5. PRIVACY POLICY
app.get('/api/privacy-policy', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('privacy_policy')
      .select('policy')
      .eq('id', 1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    res.json({ policy: data ? data.policy : '' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load privacy policy.' });
  }
});

app.put('/api/privacy-policy', verifyAdmin, async (req, res) => {
  try {
    const { policy } = req.body;
    const { error } = await supabase
      .from('privacy_policy')
      .upsert({ id: 1, policy });

    if (error) throw error;
    res.json({ success: true, message: 'Privacy policy updated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save privacy policy.' });
  }
});

// 6. NEWS
app.get('/api/news', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch news.' });
  }
});

app.post('/api/news', verifyAdmin, async (req, res) => {
  const { title, summary, content, image, category } = req.body;
  try {
    const { data, error } = await supabase
      .from('news')
      .insert([{
        title,
        summary,
        content,
        image: image || '',
        category: category || 'Announcement'
      }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create news article.' });
  }
});

app.delete('/api/news/:id', verifyAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete news article.' });
  }
});

// 7. RELEASES (Audio Label releases)
app.get('/api/releases', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('releases')
      .select('*');

    if (error) throw error;

    const mapped = (data || []).map(item => ({
      id: item.id,
      title: item.title,
      artist: item.artist,
      genre: item.genre,
      image: item.image,
      releaseDate: item.release_date
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch releases.' });
  }
});

app.post('/api/releases', verifyAdmin, async (req, res) => {
  const { title, artist, genre, image, releaseDate } = req.body;
  try {
    const { data, error } = await supabase
      .from('releases')
      .insert([{
        title,
        artist,
        genre: genre || 'Soundtrack',
        image: image || '',
        release_date: releaseDate || new Date().toISOString().split('T')[0]
      }])
      .select()
      .single();

    if (error) throw error;

    const mapped = {
      id: data.id,
      title: data.title,
      artist: data.artist,
      genre: data.genre,
      image: data.image,
      releaseDate: data.release_date
    };
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create release.' });
  }
});

app.delete('/api/releases/:id', verifyAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('releases')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete release.' });
  }
});

// 8. CAREERS JOBS LIST
app.get('/api/jobs', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*');

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch jobs.' });
  }
});

app.post('/api/jobs', verifyAdmin, async (req, res) => {
  const { title, department, type, location, description } = req.body;
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert([{
        title,
        department: department || 'Production',
        type: type || 'Full-time',
        location: location || 'Bengaluru',
        description
      }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create job opening.' });
  }
});

app.delete('/api/jobs/:id', verifyAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
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
