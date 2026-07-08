# Hero Slider Images

Drop your photos directly into this folder — **no renaming required**.

The site reads your actual filenames from `src/constants/pageHeroSlides.ts`. After adding new images, add the filename to that file and they will appear in every page hero slider.

## Current setup

All images in this folder rotate on **every page hero** (homepage, About, Contact, Programmes, Team, etc.).

## Guidelines

- **Format:** JPG or PNG
- **Size:** 1920×1080px or larger (landscape works best)
- **Content:** Mahilala events, workshops, youth sessions, team photos, community activities

## Adding more images

1. Copy your new photo into this folder (keep its original name).
2. Open `src/constants/pageHeroSlides.ts`.
3. Add the filename to the `HERO_IMAGE_FILES` array.

## Note on special characters

Avoid filenames with spaces or accented characters (e.g. `WhatsApp Image…`) — they can break in browsers. Use simple names like `IMG_3033.jpg` instead.
