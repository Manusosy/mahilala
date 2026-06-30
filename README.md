# ESAORA Consortium Website

This repository contains the source code for the ESAORA Consortium website and its supporting services. The project is structured as a monorepo using `pnpm` workspaces.

## Project Structure

- `artifacts/esaora-website`: The primary public-facing portal built with React, Vite, and TailwindCSS.
- `artifacts/esaora-admin`: The administrative management portal built with React and `@workspace/esaora-core`.
- `artifacts/mockup-sandbox`: A sandbox for UI/UX prototyping and component development.
- `lib/esaora-core`: Shared business logic, Supabase authentication, and database types.
- `scripts/`: Development and utility scripts for the monorepo.

## Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [pnpm](https://pnpm.io/) (Installed via `npm install -g pnpm`)

## Getting Started

### 1. Install Dependencies

From the root of the project, run:

```bash
pnpm install
```

### 2. Start Development Servers

You can start the different services separately using the following commands from the root:

#### Start Public Website
Accessible at http://localhost:5000

```bash
pnpm --filter @workspace/esaora-website run dev
```

#### Start Administrative Portal
Accessible at http://localhost:5001

```bash
pnpm --filter @workspace/esaora-admin run dev --port 5001
```

#### Start Mockup Sandbox
Accessible at http://localhost:5002

```bash
pnpm --filter @workspace/mockup-sandbox run dev
```

### 3. Build for Production

To build all packages in the workspace:

```bash
pnpm run build
```

## Technologies Used

- **Frontend:** React, TypeScript, Vite, TailwindCSS.
- **Backend/Auth:** Supabase (Auth, Postgres, Edge Functions).
- **Styling:** Vanilla CSS, TailwindCSS, Lucide Icons.
- **Package Management:** pnpm workspaces.
- **Branding & UX:** KNK Digital.
