const URL = 'https://lwolkwezafxnywngwvnj.supabase.co/rest/v1/articles?select=*,categories(*),article_tags(tags(*)),author:admin_profiles!author_id(full_name,avatar_url)&is_published=eq.true';
const ANON_KEY = 'sb_publishable_gy9GRgWOuut4i0UNOCsZtQ_Rm4XKpX_';

async function test() {
  const r = await fetch(URL, {
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`
    }
  });
  const data = await r.json();
  console.log('Result:', JSON.stringify(data, null, 2));
}

test().catch(console.error);
