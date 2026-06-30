const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || 'YOUR_SUPABASE_PAT_HERE';
const PROJECT_REF  = process.env.SUPABASE_PROJECT_REF  || 'lwolkwezafxnywngwvnj';
const API_BASE     = 'https://api.supabase.com/v1';

async function query(sql) {
  const r = await fetch(`${API_BASE}/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  });
  return await r.json();
}

async function verify() {
  // 1. Get current view count for a test article
  const res1 = await query("SELECT id, title, view_count FROM articles LIMIT 1");
  const article = res1[0];
  console.log(`Article: "${article.title}" | Current Views: ${article.view_count}`);

  // 2. Increment view count
  console.log('Incrementing view count...');
  await query(`SELECT increment_article_view('${article.id}')`);

  // 3. Verify
  const res2 = await query(`SELECT view_count FROM articles WHERE id = '${article.id}'`);
  console.log(`New Views: ${res2[0].view_count}`);
  
  if (res2[0].view_count === (article.view_count || 0) + 1) {
    console.log('SUCCESS: View count incremented correctly.');
  } else {
    console.error('FAILURE: View count did not increment correctly.');
  }
}

verify();
