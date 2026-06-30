/**
 * ESA-ORA Database Migration Script
 * Applies the full schema to the Supabase project via Management API.
 * Run: node scripts/migrate.mjs
 */

const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || 'YOUR_SUPABASE_PAT_HERE';
const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'vhghdtsoudkbgpofzmoc';
const API_BASE = 'https://api.supabase.com/v1';

async function runSQL(label, sql) {
  console.log(`\n⏳ Running: ${label}`);
  const response = await fetch(`${API_BASE}/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });

  const text = await response.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }

  if (!response.ok) {
    console.error(`❌ Failed (${response.status}):`, JSON.stringify(data, null, 2));
    throw new Error(`Migration failed: ${label}`);
  }
  console.log(`✅ Done: ${label}`);
  return data;
}

async function migrate() {
  console.log('🚀 ESA-ORA Database Migration Started');
  console.log(`   Project: ${PROJECT_REF}`);

  // ── BLOCK 1: Extensions ──────────────────────────────────────────────────
  await runSQL('pgcrypto extension', `CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

  // ── BLOCK 2: Core Tables ─────────────────────────────────────────────────
  await runSQL('categories table', `
    CREATE TABLE IF NOT EXISTS categories (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text UNIQUE NOT NULL,
      slug text UNIQUE NOT NULL,
      color text DEFAULT '#00d2ff',
      created_at timestamptz DEFAULT now()
    );
  `);

  await runSQL('tags table', `
    CREATE TABLE IF NOT EXISTS tags (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text UNIQUE NOT NULL,
      slug text UNIQUE NOT NULL,
      created_at timestamptz DEFAULT now()
    );
  `);

  await runSQL('articles table', `
    CREATE TABLE IF NOT EXISTS articles (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      slug text UNIQUE NOT NULL,
      title text NOT NULL,
      excerpt text,
      body text NOT NULL DEFAULT '',
      category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
      cover_image_url text,
      tag_color text DEFAULT '#00d2ff',
      is_published boolean DEFAULT false,
      is_featured boolean DEFAULT false,
      published_at timestamptz,
      author_id uuid,
      view_count integer DEFAULT 0,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  `);

  await runSQL('article_tags table', `
    CREATE TABLE IF NOT EXISTS article_tags (
      article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
      tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (article_id, tag_id)
    );
  `);

  await runSQL('programs table', `
    CREATE TABLE IF NOT EXISTS programs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      slug text UNIQUE NOT NULL,
      name text NOT NULL,
      pillar text NOT NULL,
      countries text[] DEFAULT '{}',
      summary text,
      body text DEFAULT '',
      key_output text,
      cover_image_url text,
      status text DEFAULT 'active',
      start_date date,
      end_date date,
      is_published boolean DEFAULT true,
      sort_order integer DEFAULT 0,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  `);

  await runSQL('reports table', `
    CREATE TABLE IF NOT EXISTS reports (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title text NOT NULL,
      category text NOT NULL,
      report_type text,
      description text,
      file_url text,
      cover_image_url text,
      page_count integer,
      published_date date,
      is_published boolean DEFAULT true,
      is_featured boolean DEFAULT false,
      color text DEFAULT '#00d2ff',
      download_count integer DEFAULT 0,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  `);

  await runSQL('partners table', `
    CREATE TABLE IF NOT EXISTS partners (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      logo_url text,
      website_url text,
      country text,
      description text,
      type text DEFAULT 'member',
      is_founding boolean DEFAULT false,
      is_active boolean DEFAULT true,
      sort_order integer DEFAULT 0,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  `);

  await runSQL('gallery_items table', `
    CREATE TABLE IF NOT EXISTS gallery_items (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      image_url text NOT NULL,
      caption text,
      category text,
      country text,
      is_published boolean DEFAULT true,
      sort_order integer DEFAULT 0,
      created_at timestamptz DEFAULT now()
    );
  `);

  await runSQL('team_members table', `
    CREATE TABLE IF NOT EXISTS team_members (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      title text NOT NULL,
      bio text,
      photo_url text,
      country text,
      organization text,
      email text,
      linkedin_url text,
      role text DEFAULT 'staff',
      sort_order integer DEFAULT 0,
      is_active boolean DEFAULT true,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  `);

  await runSQL('contact_submissions table', `
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      organization text,
      email text NOT NULL,
      country text,
      purpose text,
      message text NOT NULL,
      status text DEFAULT 'new',
      replied_at timestamptz,
      created_at timestamptz DEFAULT now()
    );
  `);

  await runSQL('membership_applications table', `
    CREATE TABLE IF NOT EXISTS membership_applications (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      org_name text NOT NULL,
      org_type text NOT NULL,
      country text NOT NULL,
      website text,
      contact_name text NOT NULL,
      contact_title text,
      contact_email text NOT NULL,
      contact_phone text,
      focus_areas text[] DEFAULT '{}',
      motivation text NOT NULL,
      status text DEFAULT 'pending',
      reviewed_by uuid,
      reviewed_at timestamptz,
      notes text,
      created_at timestamptz DEFAULT now()
    );
  `);

  await runSQL('newsletter_subscribers table', `
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email text UNIQUE NOT NULL,
      is_subscribed boolean DEFAULT true,
      subscribed_at timestamptz DEFAULT now(),
      unsubscribed_at timestamptz
    );
  `);

  await runSQL('donations table', `
    CREATE TABLE IF NOT EXISTS donations (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      donor_name text,
      donor_email text,
      amount numeric(12,2),
      currency text DEFAULT 'USD',
      purpose text,
      status text DEFAULT 'pending',
      payment_ref text,
      created_at timestamptz DEFAULT now()
    );
  `);

  await runSQL('site_settings table', `
    CREATE TABLE IF NOT EXISTS site_settings (
      key text PRIMARY KEY,
      value jsonb NOT NULL,
      updated_at timestamptz DEFAULT now()
    );
  `);

  await runSQL('admin_profiles table', `
    CREATE TABLE IF NOT EXISTS admin_profiles (
      id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      full_name text,
      avatar_url text,
      role text DEFAULT 'editor',
      country text,
      is_active boolean DEFAULT true,
      last_login timestamptz,
      created_at timestamptz DEFAULT now()
    );
  `);

  // ── BLOCK 3: Storage Buckets ─────────────────────────────────────────────
  await runSQL('storage buckets', `
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES
      ('images', 'images', true, 10485760, ARRAY['image/jpeg','image/png','image/webp','image/gif','image/svg+xml']),
      ('documents', 'documents', true, 52428800, ARRAY['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
      ('partner-logos', 'partner-logos', true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/svg+xml']),
      ('team-photos', 'team-photos', true, 5242880, ARRAY['image/jpeg','image/png','image/webp'])
    ON CONFLICT (id) DO NOTHING;
  `);

  // ── BLOCK 4: Row Level Security ──────────────────────────────────────────
  await runSQL('enable RLS', `
    ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
    ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
    ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
    ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
    ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
    ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
    ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
    ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
    ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;
    ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
    ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
    ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
    ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
  `);

  await runSQL('public read policies', `
    CREATE POLICY IF NOT EXISTS "public_read_articles" ON articles FOR SELECT USING (is_published = true);
    CREATE POLICY IF NOT EXISTS "public_read_categories" ON categories FOR SELECT USING (true);
    CREATE POLICY IF NOT EXISTS "public_read_tags" ON tags FOR SELECT USING (true);
    CREATE POLICY IF NOT EXISTS "public_read_article_tags" ON article_tags FOR SELECT USING (true);
    CREATE POLICY IF NOT EXISTS "public_read_programs" ON programs FOR SELECT USING (is_published = true);
    CREATE POLICY IF NOT EXISTS "public_read_reports" ON reports FOR SELECT USING (is_published = true);
    CREATE POLICY IF NOT EXISTS "public_read_partners" ON partners FOR SELECT USING (is_active = true);
    CREATE POLICY IF NOT EXISTS "public_read_gallery" ON gallery_items FOR SELECT USING (is_published = true);
    CREATE POLICY IF NOT EXISTS "public_read_team" ON team_members FOR SELECT USING (is_active = true);
    CREATE POLICY IF NOT EXISTS "public_read_settings" ON site_settings FOR SELECT USING (true);
    CREATE POLICY IF NOT EXISTS "public_insert_contact" ON contact_submissions FOR INSERT WITH CHECK (true);
    CREATE POLICY IF NOT EXISTS "public_insert_membership" ON membership_applications FOR INSERT WITH CHECK (true);
    CREATE POLICY IF NOT EXISTS "public_insert_newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
    CREATE POLICY IF NOT EXISTS "public_upsert_newsletter" ON newsletter_subscribers FOR UPDATE USING (true);
  `);

  await runSQL('admin access policies', `
    CREATE POLICY IF NOT EXISTS "admin_all_articles" ON articles FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY IF NOT EXISTS "admin_all_categories" ON categories FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY IF NOT EXISTS "admin_all_tags" ON tags FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY IF NOT EXISTS "admin_all_article_tags" ON article_tags FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY IF NOT EXISTS "admin_all_programs" ON programs FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY IF NOT EXISTS "admin_all_reports" ON reports FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY IF NOT EXISTS "admin_all_partners" ON partners FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY IF NOT EXISTS "admin_all_gallery" ON gallery_items FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY IF NOT EXISTS "admin_all_team" ON team_members FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY IF NOT EXISTS "admin_all_settings" ON site_settings FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY IF NOT EXISTS "admin_read_contact" ON contact_submissions FOR SELECT USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY IF NOT EXISTS "admin_update_contact" ON contact_submissions FOR UPDATE USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY IF NOT EXISTS "admin_read_membership" ON membership_applications FOR SELECT USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY IF NOT EXISTS "admin_update_membership" ON membership_applications FOR UPDATE USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY IF NOT EXISTS "admin_read_newsletter" ON newsletter_subscribers FOR SELECT USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY IF NOT EXISTS "admin_read_donations" ON donations FOR SELECT USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY IF NOT EXISTS "admin_all_admin_profiles" ON admin_profiles FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE role IN ('super_admin','admin') AND is_active = true));
    CREATE POLICY IF NOT EXISTS "admin_read_own_profile" ON admin_profiles FOR SELECT USING (auth.uid() = id);
  `);

  // ── BLOCK 5: Seed Data ───────────────────────────────────────────────────
  await runSQL('seed categories', `
    INSERT INTO categories (name, slug, color) VALUES
      ('Announcements', 'announcements', '#00d2ff'),
      ('Programs', 'programs', '#22C55E'),
      ('Opportunities', 'opportunities', '#F59E0B'),
      ('Reports', 'reports', '#8B5CF6'),
      ('Events', 'events', '#0097a6')
    ON CONFLICT (slug) DO NOTHING;
  `);

  await runSQL('seed tags', `
    INSERT INTO tags (name, slug) VALUES
      ('WASH', 'wash'), ('Climate', 'climate'), ('Blue Economy', 'blue-economy'),
      ('Public Health', 'public-health'), ('Kenya', 'kenya'), ('Tanzania', 'tanzania'),
      ('Mozambique', 'mozambique'), ('Madagascar', 'madagascar'),
      ('Research', 'research'), ('Partnership', 'partnership'), ('Governance', 'governance')
    ON CONFLICT (slug) DO NOTHING;
  `);

  await runSQL('seed partners', `
    INSERT INTO partners (name, logo_url, website_url, country, description, type, is_founding, sort_order) VALUES
      ('Mariners for Action', '/images/partners/Mariners-FA-official-logo.png', 'https://marinersfa.org/', 'Kenya', 'Leading marine conservation, climate-resilient ocean strategies, and community empowerment initiatives along the Kenyan coast.', 'member', true, 1),
      ('Wavu', '/images/partners/wavu.png', 'https://wavu.blue/', 'Kenya (East Africa)', 'Connecting East African fish farmers with high-quality aquaculture inputs, financing options, and guaranteed offtake markets.', 'member', true, 2),
      ('Blue Economy Organisation', '/images/partners/BEO-Logo.png', 'https://beo.or.tz/', 'Tanzania', 'Dedicated to restoring marine ecosystems while enhancing the livelihoods of coastal communities across Tanzania.', 'member', true, 3),
      ('Harona', '/images/partners/Harona.png', 'https://ongharona.vercel.app/', 'Madagascar', 'Protecting Madagascar''s extraordinary world-class coral reefs and building critical environmental stewardship directly at the community level.', 'member', true, 4)
    ON CONFLICT DO NOTHING;
  `);

  await runSQL('seed site_settings', `
    INSERT INTO site_settings (key, value) VALUES
      ('hero', '{"welcome_tag":"East & Southern Africa Ocean Resilience Alliance","headline":"Resilient\nCoasts.\nResilient Communities.","subheadline":"A regional alliance of four nations — Kenya, Tanzania, Mozambique, and Madagascar — united by charter to build climate resilience, protect marine ecosystems, and strengthen coastal communities across the Western Indian Ocean.","cta_primary":{"text":"Discover Our Work","href":"/programs"},"cta_secondary":{"text":"Join the Alliance","href":"/partners"}}'),
      ('stats', '{"items":[{"value":"4","label":"Founding Nations"},{"value":"8,000+","label":"km of Coastline"},{"value":"5","label":"Technical Working Groups"},{"value":"2025","label":"Alliance Established"}]}'),
      ('social', '{"linkedin":"#","twitter":"#","facebook":"#","youtube":"#"}'),
      ('contact', '{"secretariat_email":"info@esaora.org","kenya_email":"kenya@esaora.org","tanzania_email":"tanzania@esaora.org","mozambique_email":"mozambique@esaora.org","madagascar_email":"madagascar@esaora.org"}')
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
  `);

  // ── BLOCK 6: Storage Policies ────────────────────────────────────────────
  await runSQL('storage policies', `
    CREATE POLICY IF NOT EXISTS "public_read_images" ON storage.objects FOR SELECT USING (bucket_id IN ('images','documents','partner-logos','team-photos'));
    CREATE POLICY IF NOT EXISTS "admin_upload_images" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('images','documents','partner-logos','team-photos') AND auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY IF NOT EXISTS "admin_delete_images" ON storage.objects FOR DELETE USING (bucket_id IN ('images','documents','partner-logos','team-photos') AND auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
  `);

  // ── BLOCK 7: Updated_at Trigger ──────────────────────────────────────────
  await runSQL('updated_at trigger function', `
    CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN NEW.updated_at = now(); RETURN NEW; END;
    $$ LANGUAGE plpgsql;
  `);

  await runSQL('attach updated_at triggers', `
    DROP TRIGGER IF EXISTS trg_articles_updated_at ON articles;
    CREATE TRIGGER trg_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    DROP TRIGGER IF EXISTS trg_programs_updated_at ON programs;
    CREATE TRIGGER trg_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    DROP TRIGGER IF EXISTS trg_reports_updated_at ON reports;
    CREATE TRIGGER trg_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    DROP TRIGGER IF EXISTS trg_partners_updated_at ON partners;
    CREATE TRIGGER trg_partners_updated_at BEFORE UPDATE ON partners FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    DROP TRIGGER IF EXISTS trg_team_updated_at ON team_members;
    CREATE TRIGGER trg_team_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  `);

  console.log('\n🎉 Migration completed successfully!');
  console.log('   All tables, RLS policies, seed data, and storage buckets created.');
}

migrate().catch((err) => {
  console.error('\n💥 Migration failed:', err.message);
  process.exit(1);
});
