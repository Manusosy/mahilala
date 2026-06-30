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

async function main() {
  const articles = await runSQL("SELECT title, is_published, published_at, category_id, author_id FROM articles");
  console.log('Detailed Articles:', JSON.stringify(articles, null, 2));
}

main().catch(console.error);
