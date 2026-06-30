/**
 * ESAORA Platform Reset Script
 * Runs directly against Supabase using the service-level client.
 * Preserves: partners, site_settings
 * Wipes: everything else + all auth users
 * 
 * Run with: node scripts/run-reset.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lwolkwezafxnywngwvnj.supabase.co';
// Using publishable key — for auth.users deletion we need service_role key.
// If this key cannot delete auth users, the script will log a warning.
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_publishable_gy9GRgWOuut4i0UNOCsZtQ_Rm4XKpX_';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const TABLES_TO_WIPE = [
  'article_tags',
  'articles',
  'categories',
  'tags',
  'programs',
  'reports',
  'gallery_items',
  'team_members',
  'contact_submissions',
  'membership_applications',
  'newsletter_subscribers',
  'donations',
  'admin_profiles',
];

async function truncateTable(table) {
  console.log(`  Clearing: ${table}...`);
  // Delete all rows (RLS may block TRUNCATE, DELETE works better)
  const { error, count } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) {
    // Try with a catch-all delete
    const { error: e2 } = await supabase.from(table).delete().gte('created_at', '2000-01-01');
    if (e2) {
      console.error(`  ❌ Failed to clear ${table}:`, e2.message);
    } else {
      console.log(`  ✅ Cleared ${table}`);
    }
  } else {
    console.log(`  ✅ Cleared ${table}`);
  }
}

async function main() {
  console.log('\n🔴 ESAORA PLATFORM RESET — Starting...\n');
  console.log('─'.repeat(50));

  // Step 1: Wipe all content tables
  console.log('\n📋 Step 1: Clearing content tables...');
  for (const table of TABLES_TO_WIPE) {
    await truncateTable(table);
  }

  // Step 2: Try to delete auth users via admin API
  console.log('\n👤 Step 2: Deleting auth users...');
  try {
    const { data: users, error: listErr } = await supabase.auth.admin.listUsers();
    if (listErr) {
      console.warn('  ⚠️  Cannot list auth users (needs service_role key).');
      console.warn('  → Please delete users manually in Supabase Dashboard → Authentication → Users');
    } else {
      console.log(`  Found ${users.users.length} user(s) to delete.`);
      for (const user of users.users) {
        const { error: delErr } = await supabase.auth.admin.deleteUser(user.id);
        if (delErr) {
          console.error(`  ❌ Could not delete user ${user.email}:`, delErr.message);
        } else {
          console.log(`  ✅ Deleted: ${user.email}`);
        }
      }
    }
  } catch (err) {
    console.warn('  ⚠️  Auth admin operations require service_role key.');
    console.warn('  → Delete users manually: Supabase Dashboard → Authentication → Users → Delete All');
  }

  // Step 3: Verify partners are intact
  console.log('\n🔍 Step 3: Verifying preserved data...');
  const { data: partners, error: pErr } = await supabase.from('partners').select('id, name');
  if (pErr) {
    console.error('  ❌ Could not verify partners:', pErr.message);
  } else {
    console.log(`  ✅ Partners preserved: ${partners.length} record(s)`);
    partners.forEach(p => console.log(`     - ${p.name}`));
  }

  const { data: settings } = await supabase.from('site_settings').select('key');
  console.log(`  ✅ Site settings preserved: ${settings?.length || 0} key(s)`);

  console.log('\n' + '─'.repeat(50));
  console.log('✅ Reset complete!\n');
  console.log('Next steps:');
  console.log('  1. Visit portal.esaora.org (or localhost:5001)');
  console.log('  2. Click "No credentials? Create account"');
  console.log('  3. Register with your @esaora.org email');
  console.log('  4. Enter the OTP sent to your email');
  console.log('  5. If auth users were not deleted, do it manually in Supabase Dashboard\n');
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
