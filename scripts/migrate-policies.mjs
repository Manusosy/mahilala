/**
 * ESA-ORA Policy & Seed Migration (Fix Script)
 * Run after migrate.mjs - handles policies + seed data only.
 * Run: node scripts/migrate-policies.mjs
 */

const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || 'YOUR_SUPABASE_PAT_HERE';
const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'vhghdtsoudkbgpofzmoc';
const API_BASE = 'https://api.supabase.com/v1';

async function runSQL(label, sql) {
  console.log(`\n⏳ Running: ${label}`);
  const response = await fetch(`${API_BASE}/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  });
  const text = await response.text();
  let data; try { data = JSON.parse(text); } catch { data = text; }
  if (!response.ok) { console.error(`❌ Failed (${response.status}):`, JSON.stringify(data, null, 2)); throw new Error(`Failed: ${label}`); }
  console.log(`✅ Done: ${label}`);
  return data;
}

async function migrate() {
  console.log('🔧 ESA-ORA Policy + Seed Fix Migration');

  // ── Drop existing policies (idempotent) ──────────────────────────────────
  const TABLES = [
    'articles','categories','tags','article_tags','programs','reports',
    'partners','gallery_items','team_members','contact_submissions',
    'membership_applications','newsletter_subscribers','donations',
    'site_settings','admin_profiles'
  ];
  const POLICY_NAMES = [
    'public_read_articles','public_read_categories','public_read_tags',
    'public_read_article_tags','public_read_programs','public_read_reports',
    'public_read_partners','public_read_gallery','public_read_team','public_read_settings',
    'public_insert_contact','public_insert_membership','public_insert_newsletter',
    'public_upsert_newsletter','admin_all_articles','admin_all_categories','admin_all_tags',
    'admin_all_article_tags','admin_all_programs','admin_all_reports','admin_all_partners',
    'admin_all_gallery','admin_all_team','admin_all_settings','admin_read_contact',
    'admin_update_contact','admin_read_membership','admin_update_membership',
    'admin_read_newsletter','admin_read_donations','admin_all_admin_profiles',
    'admin_read_own_profile'
  ];

  // Build DROP statements for all policies on all tables
  const dropSQL = TABLES.map(table =>
    POLICY_NAMES.map(policy => `DROP POLICY IF EXISTS "${policy}" ON ${table};`).join('\n')
  ).join('\n');
  await runSQL('drop existing policies', dropSQL);

  // ── Public read policies ─────────────────────────────────────────────────
  await runSQL('public read policies', `
    CREATE POLICY "public_read_articles" ON articles FOR SELECT USING (is_published = true);
    CREATE POLICY "public_read_categories" ON categories FOR SELECT USING (true);
    CREATE POLICY "public_read_tags" ON tags FOR SELECT USING (true);
    CREATE POLICY "public_read_article_tags" ON article_tags FOR SELECT USING (true);
    CREATE POLICY "public_read_programs" ON programs FOR SELECT USING (is_published = true);
    CREATE POLICY "public_read_reports" ON reports FOR SELECT USING (is_published = true);
    CREATE POLICY "public_read_partners" ON partners FOR SELECT USING (is_active = true);
    CREATE POLICY "public_read_gallery" ON gallery_items FOR SELECT USING (is_published = true);
    CREATE POLICY "public_read_team" ON team_members FOR SELECT USING (is_active = true);
    CREATE POLICY "public_read_settings" ON site_settings FOR SELECT USING (true);
  `);

  // ── Public insert policies (forms) ───────────────────────────────────────
  await runSQL('public insert policies', `
    CREATE POLICY "public_insert_contact" ON contact_submissions FOR INSERT WITH CHECK (true);
    CREATE POLICY "public_insert_membership" ON membership_applications FOR INSERT WITH CHECK (true);
    CREATE POLICY "public_insert_newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
    CREATE POLICY "public_upsert_newsletter" ON newsletter_subscribers FOR UPDATE USING (true);
  `);

  // ── Admin full-access policies ───────────────────────────────────────────
  await runSQL('admin policies - content', `
    CREATE POLICY "admin_all_articles" ON articles FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY "admin_all_categories" ON categories FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY "admin_all_tags" ON tags FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY "admin_all_article_tags" ON article_tags FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY "admin_all_programs" ON programs FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY "admin_all_reports" ON reports FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY "admin_all_partners" ON partners FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY "admin_all_gallery" ON gallery_items FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY "admin_all_team" ON team_members FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY "admin_all_settings" ON site_settings FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
  `);

  await runSQL('admin policies - submissions', `
    CREATE POLICY "admin_read_contact" ON contact_submissions FOR SELECT USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY "admin_update_contact" ON contact_submissions FOR UPDATE USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY "admin_read_membership" ON membership_applications FOR SELECT USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY "admin_update_membership" ON membership_applications FOR UPDATE USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY "admin_update_membership_reviewed_by" ON membership_applications FOR UPDATE USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY "admin_read_newsletter" ON newsletter_subscribers FOR SELECT USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
    CREATE POLICY "admin_read_donations" ON donations FOR SELECT USING (auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true));
  `);

  await runSQL('admin policies - profiles', `
    CREATE POLICY "admin_all_admin_profiles" ON admin_profiles FOR ALL USING (
      auth.uid() IN (SELECT id FROM admin_profiles WHERE role IN ('super_admin','admin') AND is_active = true)
    );
    CREATE POLICY "admin_read_own_profile" ON admin_profiles FOR SELECT USING (auth.uid() = id);
    CREATE POLICY "admin_update_own_profile" ON admin_profiles FOR UPDATE USING (auth.uid() = id);
  `);

  // ── Storage policies ─────────────────────────────────────────────────────
  await runSQL('drop storage policies', `
    DROP POLICY IF EXISTS "public_read_images" ON storage.objects;
    DROP POLICY IF EXISTS "admin_upload_images" ON storage.objects;
    DROP POLICY IF EXISTS "admin_delete_images" ON storage.objects;
  `);

  await runSQL('storage policies', `
    CREATE POLICY "public_read_images" ON storage.objects FOR SELECT USING (
      bucket_id IN ('images','documents','partner-logos','team-photos')
    );
    CREATE POLICY "admin_upload_images" ON storage.objects FOR INSERT WITH CHECK (
      bucket_id IN ('images','documents','partner-logos','team-photos')
      AND auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true)
    );
    CREATE POLICY "admin_update_images" ON storage.objects FOR UPDATE USING (
      bucket_id IN ('images','documents','partner-logos','team-photos')
      AND auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true)
    );
    CREATE POLICY "admin_delete_images" ON storage.objects FOR DELETE USING (
      bucket_id IN ('images','documents','partner-logos','team-photos')
      AND auth.uid() IN (SELECT id FROM admin_profiles WHERE is_active = true)
    );
  `);

  // ── Updated_at trigger ───────────────────────────────────────────────────
  await runSQL('updated_at trigger', `
    CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN NEW.updated_at = now(); RETURN NEW; END;
    $$ LANGUAGE plpgsql;

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

  // ── Seed Data ─────────────────────────────────────────────────────────────
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
      ('Mariners for Action', '/images/partners/Mariners-FA-official-logo.png', 'https://marinersfa.org/', 'Kenya', 'Leading marine conservation, climate-resilient ocean strategies, and community empowerment along the Kenyan coast.', 'member', true, 1),
      ('Wavu', '/images/partners/wavu.png', 'https://wavu.blue/', 'Kenya (East Africa)', 'Connecting East African fish farmers with high-quality aquaculture inputs, financing options, and guaranteed offtake markets.', 'member', true, 2),
      ('Blue Economy Organisation', '/images/partners/BEO-Logo.png', 'https://beo.or.tz/', 'Tanzania', 'Dedicated to restoring marine ecosystems while enhancing the livelihoods of coastal communities across Tanzania.', 'member', true, 3),
      ('Harona', '/images/partners/Harona.png', 'https://ongharona.vercel.app/', 'Madagascar', 'Protecting Madagascar''s extraordinary world-class coral reefs and building critical environmental stewardship at the community level.', 'member', true, 4)
    ON CONFLICT DO NOTHING;
  `);

  await runSQL('seed site_settings', `
    INSERT INTO site_settings (key, value) VALUES
      ('hero', '{"welcome_tag":"East & Southern Africa Ocean Resilience Alliance","headline":"Resilient\nCoasts.\nResilient Communities.","subheadline":"A regional alliance of four nations united by charter to build climate resilience, protect marine ecosystems, and strengthen coastal communities across the Western Indian Ocean.","cta_primary":{"text":"Discover Our Work","href":"/programs"},"cta_secondary":{"text":"Join the Alliance","href":"/partners"}}'),
      ('stats', '{"items":[{"value":"4","label":"Founding Nations"},{"value":"8,000+","label":"km of Coastline"},{"value":"5","label":"Technical Working Groups"},{"value":"2025","label":"Alliance Established"}]}'),
      ('social', '{"linkedin":"#","twitter":"#","facebook":"#","youtube":"#"}'),
      ('contact', '{"secretariat_email":"info@esaora.org"}')
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
  `);

  console.log('\n🎉 All policies and seed data applied successfully!');
  console.log('   Next: Create your admin user in the Supabase Auth dashboard,');
  console.log('   then add their UUID to the admin_profiles table with role = super_admin.');
}

migrate().catch((err) => { console.error('\n💥 Failed:', err.message); process.exit(1); });
