-- Ensure every auth user has an admin_profiles row (required for is_admin() RLS checks)
INSERT INTO public.admin_profiles (id, full_name, role, is_active, created_at)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)) AS full_name,
  'super_admin' AS role,
  true AS is_active,
  NOW() AS created_at
FROM auth.users u
WHERE u.id NOT IN (SELECT id FROM public.admin_profiles)
ON CONFLICT (id) DO UPDATE SET is_active = true;
