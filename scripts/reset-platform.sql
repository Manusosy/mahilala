-- ============================================================
-- ESAORA Platform Reset Script
-- Run this in: Supabase Dashboard → SQL Editor
--
-- ⚠️  THIS IS IRREVERSIBLE.
--    ✅  partners table  → PRESERVED (not touched)
--    ✅  site_settings   → PRESERVED (not touched)
--    ❌  All other content tables → CLEARED
--    ❌  All auth users  → DELETED (re-register via portal)
-- ============================================================

-- ── Step 1: Article content ──────────────────────────────────
TRUNCATE TABLE public.article_tags CASCADE;
TRUNCATE TABLE public.articles CASCADE;
TRUNCATE TABLE public.categories CASCADE;
TRUNCATE TABLE public.tags CASCADE;

-- ── Step 2: Programs ─────────────────────────────────────────
TRUNCATE TABLE public.programs CASCADE;

-- ── Step 3: Reports ──────────────────────────────────────────
TRUNCATE TABLE public.reports CASCADE;

-- ── Step 4: Gallery ──────────────────────────────────────────
TRUNCATE TABLE public.gallery_items CASCADE;

-- ── Step 5: Team members ─────────────────────────────────────
TRUNCATE TABLE public.team_members CASCADE;

-- ── Step 6: Submissions & CRM ────────────────────────────────
TRUNCATE TABLE public.contact_submissions CASCADE;
TRUNCATE TABLE public.membership_applications CASCADE;
TRUNCATE TABLE public.newsletter_subscribers CASCADE;
TRUNCATE TABLE public.donations CASCADE;

-- ── Step 7: Admin profiles (users will be deleted next) ──────
TRUNCATE TABLE public.admin_profiles CASCADE;

-- ── Step 8: Delete ALL auth users ────────────────────────────
-- This removes every registered account. You must re-register
-- after running this script using the admin portal signup flow.
DELETE FROM auth.users;

-- ── Verify: Partners preserved ───────────────────────────────
SELECT COUNT(*) AS partners_remaining FROM public.partners;

-- ── Verify: Settings preserved ───────────────────────────────
SELECT key, value FROM public.site_settings;

-- ============================================================
-- ✅ Done. Re-register at portal.esaora.org
-- ============================================================
