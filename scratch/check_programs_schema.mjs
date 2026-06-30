const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || 'YOUR_SUPABASE_PAT_HERE';
const PROJECT_REF  = process.env.SUPABASE_PROJECT_REF  || 'lwolkwezafxnywngwvnj';
const API_BASE     = 'https://api.supabase.com/v1';

async function check() {
  const r = await fetch(`${API_BASE}/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = \'programs\' AND table_schema = \'public\'' }),
  });
  const data = await r.json();
  console.log(JSON.stringify(data, null, 2));
}
check();
