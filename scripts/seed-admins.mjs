/**
 * Seed admin_profiles for all existing auth.users who don't have one.
 * This is the root cause of RLS failures - is_admin() returns false
 * because admin_profiles is empty.
 * 
 * Run: node scripts/seed-admins.mjs
 * Delete after use.
 */

const PROJECT_REF = 'lwolkwezafxnywngwvnj';
const API_BASE = 'https://api.supabase.com/v1';
// Token passed via environment variable - never hardcode
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('ERROR: Set SUPABASE_ACCESS_TOKEN env var before running.');
  process.exit(1);
}

async function runSQL(label, sql) {
  console.log(`\n⏳ ${label}`);
  const r = await fetch(`${API_BASE}/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });
  const data = await r.json();
  if (!r.ok) {
    console.error(`  ❌ Failed (${r.status}):`, JSON.stringify(data, null, 2));
    return null;
  }
  console.log(`  ✅ OK:`, JSON.stringify(data, null, 2));
  return data;
}

async function main() {
  console.log('🌱 Seeding admin_profiles from auth.users...\n');

  // Step 1: Show current state
  await runSQL('Check current admin_profiles', 'SELECT * FROM public.admin_profiles;');

  // Step 2: Seed missing admin profiles - all as super_admin since these are the founders
  await runSQL('Insert missing admin profiles', `
    INSERT INTO public.admin_profiles (id, full_name, role, is_active, created_at)
    SELECT 
      u.id,
      COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)) AS full_name,
      'super_admin' AS role,
      true AS is_active,
      NOW() AS created_at
    FROM auth.users u
    WHERE u.id NOT IN (SELECT id FROM public.admin_profiles)
    ON CONFLICT (id) DO UPDATE SET
      role = EXCLUDED.role,
      is_active = EXCLUDED.is_active;
  `);

  // Step 3: Also ensure the trigger exists to auto-create on future signups
  await runSQL('Create auto-profile trigger function', `
    CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
    AS $$
    BEGIN
      INSERT INTO public.admin_profiles (id, full_name, role, is_active, created_at)
      VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        'editor',
        true,
        NOW()
      )
      ON CONFLICT (id) DO NOTHING;
      RETURN NEW;
    END;
    $$;
  `);

  await runSQL('Drop old trigger if exists', `
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  `);

  await runSQL('Create trigger on auth.users', `
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_admin_user();
  `);

  // Step 4: Verify final state
  await runSQL('Final state of admin_profiles', 'SELECT id, full_name, role, is_active FROM public.admin_profiles;');

  console.log('\n🎉 Done! Admin profiles are seeded. All users can now write to content tables.\n');
}

main().catch(e => { console.error('\n💥 Fatal:', e.message); process.exit(1); });
