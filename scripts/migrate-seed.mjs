/**
 * ESA-ORA Seed Settings Fix (run once after migrate-policies.mjs)
 * Run: node scripts/migrate-seed.mjs
 */

const ACCESS_TOKEN = 'YOUR_SUPABASE_PAT_HERE';
const PROJECT_REF = 'lwolkwezafxnywngwvnj';
const API_BASE = 'https://api.supabase.com/v1';

async function runSQL(label, sql) {
  console.log(`\n⏳ ${label}`);
  const res = await fetch(`${API_BASE}/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  let data; try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok) { console.error(`❌ (${res.status}):`, JSON.stringify(data).slice(0, 300)); throw new Error(label); }
  console.log(`✅ ${label}`);
}

const SETTINGS = [
  {
    key: 'hero',
    value: {
      welcome_tag: 'East & Southern Africa Ocean Resilience Alliance',
      headline: 'Resilient Coasts. Resilient Communities.',
      subheadline: 'A regional alliance of four nations — Kenya, Tanzania, Mozambique, and Madagascar — united by charter to build climate resilience, protect marine ecosystems, and strengthen coastal communities across the Western Indian Ocean.',
      cta_primary: { text: 'Discover Our Work', href: '/programs' },
      cta_secondary: { text: 'Join the Alliance', href: '/partners' },
    },
  },
  {
    key: 'stats',
    value: {
      items: [
        { value: '4', label: 'Founding Nations' },
        { value: '8,000+', label: 'km of Coastline' },
        { value: '5', label: 'Technical Working Groups' },
        { value: '2025', label: 'Alliance Established' },
      ],
    },
  },
  {
    key: 'social',
    value: { linkedin: '#', twitter: '#', facebook: '#', youtube: '#' },
  },
  {
    key: 'contact',
    value: {
      secretariat_email: 'info@esaora.org',
      kenya_email: 'kenya@esaora.org',
      tanzania_email: 'tanzania@esaora.org',
      mozambique_email: 'mozambique@esaora.org',
      madagascar_email: 'madagascar@esaora.org',
    },
  },
];

async function seed() {
  console.log('🌱 Seeding site settings…');
  for (const setting of SETTINGS) {
    const jsonVal = JSON.stringify(setting.value).replace(/'/g, "''");
    await runSQL(
      `seed setting: ${setting.key}`,
      `INSERT INTO site_settings (key, value) VALUES ('${setting.key}', '${jsonVal}'::jsonb)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();`
    );
  }
  console.log('\n🎉 Database fully set up! All tables, policies, and seed data in place.');
  console.log('   👉 Next: Go to Supabase Auth → Add User, then insert their UUID into admin_profiles.');
}

seed().catch((e) => { console.error('💥', e.message); process.exit(1); });
