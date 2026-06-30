# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### ESA-ORA Website (`artifacts/esaora-website`)
- **Type**: react-vite (frontend-only, no backend needed)
- **Preview path**: `/`
- **Stack**: React + Vite + TypeScript + Tailwind CSS + GSAP
- **Features**:
  - Fullscreen hero with ocean imagery and GSAP entrance animations
  - Animated impact statistics counter bar
  - ESA-ORA Blueprint — 4-pillar interactive SVG Venn diagram (GSAP animated)
  - Scroll-triggered parallax video/image quote section
  - Interactive East Africa country map (SVG with animated connector lines)
  - Strategic Objectives horizontal slider with auto-scroll (GSAP)
  - Governance org chart with animated tier cards
  - News & Insights 3-card grid with hover effects
  - Partner logo infinite marquee (CSS animation)
  - Call-to-action section (Fund / Join / Share)
  - Full footer with social links
  - Multi-language support: English, Swahili (sw), French (fr), Portuguese (pt)
  - Sticky navbar: transparent over hero → solid navy on scroll
  - All animations respect `prefers-reduced-motion`
- **Key packages**: gsap, swiper, react-simple-maps
- **i18n**: Context-based language switcher (`src/i18n/`)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/esaora-website run dev` — run ESA-ORA website locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
