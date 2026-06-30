# Vercel deployment (Mahilala monorepo)

This repository is a **pnpm workspace**. Deploy the public site and admin dashboard as **two separate Vercel projects**, both connected to the same GitHub repo.

## Prerequisites

1. Connect [github.com/Manusosy/mahilala](https://github.com/Manusosy/mahilala) to Vercel.
2. For each project, enable **Settings → General → Root Directory** and turn on **“Include source files outside of the Root Directory in the Build Step”** (required so `lib/esaora-core` and other workspace packages resolve).
3. Set **Node.js** to 20.x or 22.x (match local dev).
4. **Install Command** and **Build Command** are defined in each app’s `vercel.json`; you can leave Vercel defaults overridden by the file.

---

## 1. Public website (`mahilala-website` suggested name)

| Setting | Value |
|--------|--------|
| **Root Directory** | `artifacts/esaora-website` |
| **Framework Preset** | Vite (or Other) |
| **Install Command** | `cd ../.. && pnpm install` |
| **Build Command** | `pnpm run build` |
| **Output Directory** | `dist` |

`vercel.json` in that folder already sets install/build/output and SPA rewrites for **wouter** client routes.

### Environment variables (Production & Preview)

| Variable | Required | Notes |
|----------|----------|--------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase publishable (anon) key |
| `VITE_ADMIN_SKIP_OTP` | No | **Do not set `true` in production.** Website should omit this or set `false`. |

Optional: `BASE_PATH` if hosting under a subpath (default `/`).

### Custom domain

Point your public domain (e.g. `mahilala.mg`) to this project’s Production deployment.

---

## 2. Admin dashboard (`mahilala-admin` suggested name)

| Setting | Value |
|--------|--------|
| **Root Directory** | `artifacts/esaora-admin` |
| **Framework Preset** | Vite (or Other) |
| **Install Command** | `cd ../.. && pnpm install` |
| **Build Command** | `pnpm run build` |
| **Output Directory** | `dist` |

### Environment variables (Production & Preview)

| Variable | Required | Notes |
|----------|----------|--------|
| `VITE_SUPABASE_URL` | Yes | Same Supabase project as the website |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Same publishable key |
| `VITE_ADMIN_SKIP_OTP` | No | **Must be `false` or unset in production** so OTP login stays enforced |

Use a separate subdomain (e.g. `admin.mahilala.mg`) for the admin project.

---

## Local build verification

From repo root (after `pnpm install`):

```bash
pnpm --filter @workspace/esaora-website run build
pnpm --filter @workspace/esaora-admin run build
```

Root `pnpm run build` also runs TypeScript project references and `typecheck`; some Supabase-generated types may fail strict checks even when Vite production builds succeed. Vercel uses each app’s `pnpm run build` (Vite only) via `vercel.json`.

---

## Security

- Never commit `.env` files. Copy from `.env.example` locally.
- All `VITE_*` variables are embedded in the client bundle—only use public Supabase keys, never service role keys.
- Rotate Supabase keys if `.env` was ever pushed to Git history.
