const ACCESS_TOKEN = 'YOUR_SUPABASE_PAT_HERE';
const PROJECT_REF  = 'lwolkwezafxnywngwvnj';
const API_BASE     = 'https://api.supabase.com/v1';

async function runSQL(sql) {
  const r = await fetch(`${API_BASE}/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  });
  const data = await r.json();
  if (!r.ok) {
    console.error('SQL Error:', JSON.stringify(data, null, 2));
    throw new Error('SQL execution failed');
  }
  return data;
}

async function fix() {
  console.log('Adding public read policy for admin_profiles...');
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
  console.log('Policy added successfully.');
}

fix().catch(console.error);
