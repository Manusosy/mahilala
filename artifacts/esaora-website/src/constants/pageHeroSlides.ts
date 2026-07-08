import type { HeroSlide } from '@/components/HeroSliderBackground';

/** Images you added to public/images/heroes/ */
const HERO_IMAGE_FILES = [
  'IMG-20251206-WA0003.jpg',
  'IMG-20251206-WA0004.jpg',
  'IMG-20251206-WA0038.jpg',
  'IMG-20251206-WA0040.jpg',
  'IMG_20230729_101635.jpg',
  'IMG_20230729_101706.jpg',
  'IMG_20251009_125011_364.jpg',
  'IMG_3033.jpg',
  'IMG_3047.jpg',
  'IMG_3064.jpg',
  'IMG_3065.jpg',
  'IMG_3074.jpg',
  'IMG_3090.jpg',
  'IMG_3180.jpg',
  'IMG_3195.jpg',
  'IMG_3284.jpg',
  'IMG_5348.jpg',
  'IMG_5374.jpg',
  'IMG_6788.jpg',
] as const;

function toSlides(files: readonly string[], altPrefix: string): HeroSlide[] {
  return files.map((file, i) => ({
    id: `hero-${file.replace(/[^a-zA-Z0-9]/g, '-')}`,
    url: `/images/heroes/${encodeURIComponent(file)}`,
    alt: `${altPrefix} — photo ${i + 1}`,
  }));
}

/** Shared pool — all hero images rotate on every page */
const SHARED_HERO_SLIDES = toSlides(HERO_IMAGE_FILES, 'Mahilala Madagascar');

export const PAGE_HERO_SLIDES = {
  home: SHARED_HERO_SLIDES,
  about: SHARED_HERO_SLIDES,
  contact: SHARED_HERO_SLIDES,
  programs: SHARED_HERO_SLIDES,
  team: SHARED_HERO_SLIDES,
  news: SHARED_HERO_SLIDES,
  gallery: SHARED_HERO_SLIDES,
  partners: SHARED_HERO_SLIDES,
  madagascar: SHARED_HERO_SLIDES,
  reports: SHARED_HERO_SLIDES,
  donate: SHARED_HERO_SLIDES,
  legal: SHARED_HERO_SLIDES,
} as const satisfies Record<string, readonly HeroSlide[]>;
