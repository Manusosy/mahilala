-- Seed Mahilala Madagascar core partners (editable via Admin → Partners)
-- Safe to re-run: skips rows that already exist by name.

INSERT INTO public.partners (
  name,
  logo_url,
  website_url,
  country,
  description,
  type,
  is_founding,
  is_active,
  sort_order
)
SELECT * FROM (VALUES
  (
    'RAIKY',
    '/images/partners/Mariners-FA-official-logo.png',
    NULL,
    'Madagascar',
    'Ongoing collaboration supporting youth and community initiatives in Toliara.',
    'strategic',
    true,
    true,
    1
  ),
  (
    'MOVE ON: Be Ready for Change',
    '/images/partners/wavu.png',
    NULL,
    'Madagascar',
    'Partner in the Ady Fototra civic responsibility movement across Atsimo-Andrefana.',
    'strategic',
    true,
    true,
    2
  ),
  (
    'VOIZO Madagascar',
    '/images/partners/BEO-Logo.png',
    NULL,
    'Madagascar',
    'Marine bioecology training for fishing communities along the southwest coast.',
    'strategic',
    true,
    true,
    3
  ),
  (
    'IH.SM',
    '/images/partners/Harona.png',
    NULL,
    'Toliara',
    'BlueDays at School collaboration — student-led environmental education in schools.',
    'strategic',
    true,
    true,
    4
  )
) AS seed(name, logo_url, website_url, country, description, type, is_founding, is_active, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM public.partners p WHERE p.name = seed.name
);
