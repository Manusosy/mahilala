/**
 * ESA-ORA Storage Bucket Setup Script
 * Creates the required storage buckets and policies in Supabase.
 * Run: node scripts/setup-storage.mjs
 */

const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || 'YOUR_SUPABASE_PAT_HERE';
const PROJECT_REF  = process.env.SUPABASE_PROJECT_REF  || 'vhghdtsoudkbgpofzmoc';
const API_BASE     = 'https://api.supabase.com/v1';

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
    return false;
  }
  console.log(`✅ Done: ${label}`);
  return data;
}

async function createBucket(name, isPublic = true) {
  // Use SQL to upsert into storage.buckets — works with the Management API token
  const sql = `
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types, avif_autodetection)
    VALUES (
      '${name}',
      '${name}',
      ${isPublic},
      52428800,
      NULL,
      false
    )
    ON CONFLICT (id) DO UPDATE SET
      public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit;
  `;
  const ok = await runSQL(`Create bucket: ${name}`, sql);
  return ok !== false;
}

async function setup() {
  console.log('🪣  ESA-ORA Storage Setup');
  console.log(`   Project: ${PROJECT_REF}\n`);

  // 1. Create buckets (all public so the frontend can display images without auth)
  const buckets = ['images', 'documents', 'partner-logos', 'team-photos'];
  for (const b of buckets) {
    await createBucket(b, true);
  }

  // 2. Drop existing (possibly conflicting) storage policies and recreate clean ones
  await runSQL('Drop old storage policies', `
    DO $$
    DECLARE r RECORD;
    BEGIN
      FOR r IN SELECT policyname, tablename
               FROM pg_policies
               WHERE schemaname = 'storage'
      LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.%I', r.policyname, r.tablename);
      END LOOP;
    END $$;
  `);

  // 3. Objects table policies
  // PUBLIC: anyone can read objects in public buckets (images, partner-logos, team-photos)
  await runSQL('Storage: public read for image buckets', `
    CREATE POLICY "Public read – image buckets"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('images', 'partner-logos', 'team-photos'));
  `);

  await runSQL('Storage: public read for documents', `
    CREATE POLICY "Public read – documents"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'documents');
  `);

  // AUTHENTICATED: admins can insert (upload) into any bucket
  await runSQL('Storage: authenticated upload', `
    CREATE POLICY "Authenticated upload"
    ON storage.objects FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');
  `);

  // AUTHENTICATED: admins can update (replace) their own uploads
  await runSQL('Storage: authenticated update', `
    CREATE POLICY "Authenticated update"
    ON storage.objects FOR UPDATE
    USING (auth.role() = 'authenticated');
  `);

  // AUTHENTICATED: admins can delete objects
  await runSQL('Storage: authenticated delete', `
    CREATE POLICY "Authenticated delete"
    ON storage.objects FOR DELETE
    USING (auth.role() = 'authenticated');
  `);

  // 4. Buckets table policies (needed for listing buckets)
  await runSQL('Storage: buckets public read', `
    CREATE POLICY "Public bucket listing"
    ON storage.buckets FOR SELECT
    USING (true);
  `);

  console.log('\n🎉 Storage setup complete. All buckets and policies applied.\n');
}

setup().catch((err) => {
  console.error('\n💥 Setup failed:', err.message);
  process.exit(1);
});
