# Financy Web

Frontend application for the Financy project, built as part of a final postgraduate project at Rocketseat Faculty of Technology.

## Goal

Deliver the web interface for user authentication and financial management, consuming the Financy GraphQL API.

## Stack

- React 19
- TypeScript
- Vite
- Apollo Client
- React Hook Form + Zod
- Zustand
- Tailwind CSS
- Biome

## Prerequisites

- Node.js 20+
- pnpm
- Financy backend running locally

## Backend Integration

Apollo Client behavior:

- Uses `VITE_BACKEND_URL`
- Sends cookies with `credentials: include`

Development proxy behavior:

- Vite proxies `/graphql` to `http://localhost:3333`
- This allows local frontend calls without hardcoding an absolute API URL
pnpm lint:biome   # run biome lint

# Financy Web

Frontend application for the Financy project.

---

## 🏁 First Time Setup

If you are new to programming, start from the [main README](../README.md) for a step-by-step guide to running the full project (backend + frontend).

---

## ⚙️ Local Development (Frontend Only)

**Note:** The backend must be running for the frontend to work. See [financy-server/README.md](../financy-server/README.md) for backend setup.

1. **Install dependencies**
	```bash
	pnpm install
	```
2. **Start the frontend**
	```bash
	pnpm dev
	```

Frontend app: http://localhost:5173

---

## 🔗 Backend Integration

- Apollo Client uses `VITE_BACKEND_URL` and sends cookies with `credentials: include`.
- Vite proxies `/graphql` to `http://localhost:3333` for local development.

---

## 📂 Project Structure

- `src/pages`: application pages
- `src/router`: routing and route guards
- `src/lib/graphql`: Apollo client, queries, and mutations
- `src/stores`: global state stores
- `src/components`: reusable UI components

---

## 🧪 Scripts & Quality

Common scripts:
```bash
pnpm dev          # start Vite development server
pnpm build        # run TypeScript build and create production bundle
pnpm preview      # preview production bundle locally
pnpm format       # format code with Biome
pnpm lint         # run biome check
pnpm lint:biome   # run biome lint
pnpm check:biome  # run biome check
```

---

## ✅ Current Feature Status

- Authentication (sign in, sign up, session sync with `me`): implemented
- Public and protected routing: implemented
- Authenticated routes: `/dashboard`, `/transactions`, `/categories`, `/profile`
- Dashboard, transactions, and categories pages: todas as funcionalidades do desafio implementadas e estáveis
