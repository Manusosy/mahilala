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
  console.log('Assigning first admin as author to all articles...');
  const result = await runSQL(`
    UPDATE articles 
    SET author_id = (SELECT id FROM admin_profiles WHERE is_active = true LIMIT 1)
    WHERE author_id IS NULL;
  `);
  console.log('Update result:', JSON.stringify(result, null, 2));
}

fix().catch(console.error);
