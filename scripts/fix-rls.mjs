/**
 * Fix: Admin Profiles RLS Infinite Recursion
 * Replaces all inline `SELECT id FROM admin_profiles` subqueries in policies
 * with SECURITY DEFINER helper functions that bypass RLS.
 * Run: node scripts/fix-rls.mjs
 */

const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || 'YOUR_SUPABASE_PAT_HERE';
const PROJECT_REF  = process.env.SUPABASE_PROJECT_REF  || 'lwolkwezafxnywngwvnj';
const API_BASE     = 'https://api.supabase.com/v1';

async function runSQL(label, sql) {
  console.log(`\n⏳ ${label}`);
  const r = await fetch(`${API_BASE}/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  });
  const text = await r.text();
  let data; try { data = JSON.parse(text); } catch { data = text; }
  if (!r.ok) { console.error(`  ❌ Failed (${r.status}):`, JSON.stringify(data, null, 2)); return false; }
  console.log(`  ✅ OK`);
  return true;
}

async function fix() {
  console.log('🔧 Fixing RLS infinite recursion on admin_profiles\n');

  // 1. Create SECURITY DEFINER helpers — these bypass RLS when called inside policies
  await runSQL('Create is_admin() helper', `
    CREATE OR REPLACE FUNCTION public.is_admin()
    RETURNS boolean
    LANGUAGE sql
    SECURITY DEFINER
    STABLE
    SET search_path = public
    AS $$
      SELECT EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE id = auth.uid()
        AND is_active = true
      );
    $$;
  `);

  await runSQL('Create is_superadmin() helper', `
    CREATE OR REPLACE FUNCTION public.is_superadmin()
    RETURNS boolean
    LANGUAGE sql
    SECURITY DEFINER
    STABLE
    SET search_path = public
    AS $$
      SELECT EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin')
        AND is_active = true
      );
    $$;
  `);

  // 2. Drop ALL existing admin policies (they all contain the recursive subquery)
  await runSQL('Drop all old admin policies', `
    DO $$
    DECLARE r RECORD;
    BEGIN
      FOR r IN
        SELECT policyname, tablename, schemaname
        FROM pg_policies
        WHERE (policyname LIKE 'admin_%' OR policyname LIKE 'Authenticated%')
      LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
      END LOOP;
    END $$;
  `);

  // 3. Recreate admin_profiles policies WITHOUT self-referencing subquery
  await runSQL('Recreate admin_profiles policies', `
    -- Super/admin can manage all profiles
    CREATE POLICY "admin_all_admin_profiles" ON admin_profiles FOR ALL
      USING (public.is_superadmin())
      WITH CHECK (public.is_superadmin());

    -- Every admin can read their own profile (needed for login)
    CREATE POLICY "admin_read_own_profile" ON admin_profiles FOR SELECT
      USING (auth.uid() = id);

    -- Every admin can update their own profile
    CREATE POLICY "admin_update_own_profile" ON admin_profiles FOR UPDATE
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  `);

  // 4. Recreate all content table admin policies using the helper
  await runSQL('Admin policies: content tables', `
    CREATE POLICY "admin_all_articles"     ON articles     FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
    CREATE POLICY "admin_all_categories"   ON categories   FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
    CREATE POLICY "admin_all_tags"         ON tags         FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
    CREATE POLICY "admin_all_article_tags" ON article_tags FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
    CREATE POLICY "admin_all_programs"     ON programs     FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
    CREATE POLICY "admin_all_reports"      ON reports      FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
    CREATE POLICY "admin_all_partners"     ON partners     FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
    CREATE POLICY "admin_all_gallery"      ON gallery_items FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
    CREATE POLICY "admin_all_team"         ON team_members FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
    CREATE POLICY "admin_all_settings"     ON site_settings FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
  `);

  await runSQL('Admin policies: submissions', `
    CREATE POLICY "admin_read_contact"    ON contact_submissions      FOR SELECT USING (public.is_admin());
    CREATE POLICY "admin_update_contact"  ON contact_submissions      FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
    CREATE POLICY "admin_read_membership" ON membership_applications  FOR SELECT USING (public.is_admin());
    CREATE POLICY "admin_update_membership" ON membership_applications FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
    CREATE POLICY "admin_read_newsletter" ON newsletter_subscribers   FOR SELECT USING (public.is_admin());
    CREATE POLICY "admin_read_donations"  ON donations                FOR SELECT USING (public.is_admin());
  `);

  // 5. Recreate storage policies using helper
  await runSQL('Admin policies: storage', `
    CREATE POLICY "admin_upload_images" ON storage.objects FOR INSERT
      WITH CHECK (
        bucket_id IN ('images', 'documents', 'partner-logos', 'team-photos')
        AND public.is_admin()
      );
    CREATE POLICY "admin_update_images" ON storage.objects FOR UPDATE
      USING (
        bucket_id IN ('images', 'documents', 'partner-logos', 'team-photos')
        AND public.is_admin()
      );
    CREATE POLICY "admin_delete_images" ON storage.objects FOR DELETE
      USING (
        bucket_id IN ('images', 'documents', 'partner-logos', 'team-photos')
        AND public.is_admin()
      );
  `);

  console.log('\n\n🎉 RLS fix complete. All admin policies now use SECURITY DEFINER helpers.\n');
}

fix().catch(e => { console.error('\n💥 Failed:', e.message); process.exit(1); });
