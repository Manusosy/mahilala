const ACCESS_TOKEN = 'YOUR_SUPABASE_PAT_HERE';
const PROJECT_REF  = 'lwolkwezafxnywngwvnj';
const API_BASE     = 'https://api.supabase.com/v1';

async function runSQL(sql) {
  const r = await fetch(`${API_BASE}/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  });
  return await r.json();
}

async function fix() {
  console.log('Adding Foreign Key constraint and public policies...');
  
  // 1. Add Foreign Key if missing
  await runSQL(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'articles_author_id_fkey'
      ) THEN
        ALTER TABLE articles 
        ADD CONSTRAINT articles_author_id_fkey 
        FOREIGN KEY (author_id) REFERENCES admin_profiles(id);
      END IF;
    END $$;
  `);

  // 2. Ensure author profiles are public-readable (essential for joins)
  await runSQL(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'admin_profiles' 
        AND policyname = 'public_read_admin_profiles'
      ) THEN
        CREATE POLICY "public_read_admin_profiles" ON admin_profiles 
          FOR SELECT 
          USING (true);
      END IF;
    END $$;
  `);

  // 3. Data Cleanup: Assign an author to any orphans
  await runSQL(`
    UPDATE articles 
    SET author_id = (SELECT id FROM admin_profiles WHERE is_active = true LIMIT 1)
    WHERE author_id IS NULL;
  `);

  console.log('Fix applied successfully.');
}

fix().catch(console.error);
