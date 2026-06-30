const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || 'YOUR_SUPABASE_PAT_HERE';
const PROJECT_REF  = process.env.SUPABASE_PROJECT_REF  || 'vhghdtsoudkbgpofzmoc';
const API_BASE     = 'https://api.supabase.com/v1';

const sql = `
-- Expand programs table
ALTER TABLE programs 
ADD COLUMN IF NOT EXISTS objectives TEXT,
ADD COLUMN IF NOT EXISTS challenges TEXT,
ADD COLUMN IF NOT EXISTS impact TEXT,
ADD COLUMN IF NOT EXISTS focus_areas TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS funding_status TEXT DEFAULT 'unfunded',
ADD COLUMN IF NOT EXISTS funding_goal NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS funding_raised NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS video_url TEXT;
`;

async function migrate() {
  console.log('Applying Programs expansion migration to project:', PROJECT_REF);
  const r = await fetch(`${API_BASE}/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: { 
      Authorization: `Bearer ${ACCESS_TOKEN}`, 
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ query: sql }),
  });
  
  const result = await r.json();
  if (!r.ok) {
    console.error('Migration failed:', JSON.stringify(result, null, 2));
    process.exit(1);
  }
  
  console.log('Programs migration applied successfully!');
}

migrate();
