const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || 'YOUR_SUPABASE_PAT_HERE';
const PROJECT_REF  = process.env.SUPABASE_PROJECT_REF  || 'lwolkwezafxnywngwvnj';
const API_BASE     = 'https://api.supabase.com/v1';

async function runSQL(label, sql) {
  console.log(`\n⏳ ${label}`);
  const r = await fetch(`${API_BASE}/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  });
  const text = await r.text();
  let data; try { data = JSON.parse(text); } catch { data = text; }
  if (!r.ok) { console.error(`  ❌ Failed (${r.status}):`, JSON.stringify(data, null, 2)); return false; }
  console.log(`  ✅ OK`);
  return true;
}

async function fix() {
  console.log('🔧 Finalizing Admin Permissions & RLS\n');

  // 1. Add the admin profile
  await runSQL('Add Super Admin profile', `
    INSERT INTO public.admin_profiles (id, full_name, role, is_active)
    VALUES ('e7647664-81a8-4f07-a978-b346c55e0818', 'Emanuel', 'super_admin', true)
    ON CONFLICT (id) DO UPDATE SET 
      role = 'super_admin',
      is_active = true;
  `);

  // 2. Fix policies with explicit schema prefix
  await runSQL('Fix Articles policies', `
    DROP POLICY IF EXISTS "admin_all_articles" ON articles;
    CREATE POLICY "admin_all_articles" ON articles FOR ALL 
      USING (public.is_admin()) 
      WITH CHECK (public.is_admin());
  `);

  await runSQL('Fix Categories policies', `
    DROP POLICY IF EXISTS "admin_all_categories" ON categories;
    CREATE POLICY "admin_all_categories" ON categories FOR ALL 
      USING (public.is_admin()) 
      WITH CHECK (public.is_admin());
  `);

  await runSQL('Fix Tags policies', `
    DROP POLICY IF EXISTS "admin_all_tags" ON tags;
    CREATE POLICY "admin_all_tags" ON tags FOR ALL 
      USING (public.is_admin()) 
      WITH CHECK (public.is_admin());
  `);

  await runSQL('Fix Article Tags policies', `
    DROP POLICY IF EXISTS "admin_all_article_tags" ON article_tags;
    CREATE POLICY "admin_all_article_tags" ON article_tags FOR ALL 
      USING (public.is_admin()) 
      WITH CHECK (public.is_admin());
  `);

  console.log('\n\n🎉 Permissions restored. You should now be able to save articles.');
}

fix().catch(e => { console.error('\n💥 Failed:', e.message); process.exit(1); });
