import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('[ERROR] MONGODB_URI environment variable is missing. Cannot sync database.');
  process.exit(1);
}

(async () => {
  console.log('[INFO] Connecting to MongoDB...');
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db();
  console.log('[INFO] Connected successfully.');

  const dbJsonPath = path.join(process.cwd(), 'db.json');
  if (!fs.existsSync(dbJsonPath)) {
    console.error('[ERROR] db.json not found.');
    await client.close();
    process.exit(1);
  }

  const dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));

  // 1. Update Admin credentials
  if (dbData['admin:credentials']) {
    console.log('[INFO] Updating admin_credentials...');
    const adminCol = db.collection('admin_credentials');
    const creds = dbData['admin:credentials'];
    
    // We update any admin account to use the new iydani domain
    await adminCol.updateOne(
      {},
      { $set: { email: creds.email, password_hash: creds.passwordHash } },
      { upsert: true }
    );
    console.log('[SUCCESS] Admin credentials updated.');
  }

  // 2. Update Site Settings
  if (dbData['site:settings']) {
    console.log('[INFO] Updating site_settings...');
    const settingsCol = db.collection('site_settings');
    const s = dbData['site:settings'];
    
    await settingsCol.replaceOne(
      { id: 1 },
      {
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
      },
      { upsert: true }
    );
    console.log('[SUCCESS] Site settings updated.');
  }

  // 3. Update Privacy Policy
  if (dbData['privacy-policy']) {
    console.log('[INFO] Updating privacy_policy...');
    const privacyCol = db.collection('privacy_policy');
    await privacyCol.replaceOne(
      { id: 1 },
      { id: 1, policy: dbData['privacy-policy'] },
      { upsert: true }
    );
    console.log('[SUCCESS] Privacy policy updated.');
  }

  console.log('[INFO] Database sync completed successfully!');
  await client.close();
})().catch(err => {
  console.error('[ERROR] Database sync failed:', err);
  process.exit(1);
});
