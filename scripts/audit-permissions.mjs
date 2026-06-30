const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || 'YOUR_SUPABASE_PAT_HERE';
const PROJECT_REF  = process.env.SUPABASE_PROJECT_REF  || 'lwolkwezafxnywngwvnj';
const API_BASE     = 'https://api.supabase.com/v1';

async function audit() {
  const queries = [
    { label: 'Articles Policies', sql: "SELECT * FROM pg_policies WHERE tablename = 'articles'" },
    { label: 'Admin Profiles Content', sql: "SELECT id, email, role, is_active FROM admin_profiles" },
    { label: 'Functions', sql: "SELECT routine_name, routine_type FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name IN ('is_admin', 'is_superadmin')" }
  ];

  for (const q of queries) {
    console.log(`\n--- ${q.label} ---`);
    const r = await fetch(`${API_BASE}/projects/${PROJECT_REF}/database/query`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q.sql }),
    });
    const data = await r.json();
    console.log(JSON.stringify(data, null, 2));
  }
}
audit();
