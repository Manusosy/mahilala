const PROJECT_REF = 'lwolkwezafxnywngwvnj';
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const query = `
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
    'super_admin',
    true,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET role = 'super_admin';
  RETURN NEW;
END;
$$;
`;

fetch('https://api.supabase.com/v1/projects/'+PROJECT_REF+'/database/query', {
  method:'POST',
  headers:{Authorization:'Bearer '+TOKEN,'Content-Type':'application/json'},
  body:JSON.stringify({query})
}).then(r=>r.json()).then(d=>{
  console.log('Trigger Updated:', JSON.stringify(d, null, 2));
}).catch(e=>console.error(e));
