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

- Uses `VITE_GRAPHQL_URL` when provided
- Falls back to `/graphql` when `VITE_GRAPHQL_URL` is not set
- Sends cookies with `credentials: include`

Development proxy behavior:

- Vite proxies `/graphql` to `http://localhost:3333`
- This allows local frontend calls without hardcoding an absolute API URL

## Run Locally

1. Start backend in a separate terminal:

```bash
cd ../financy-server
pnpm install
# Configure .env.dev first (see financy-server README)
pnpm dev
```

2. Start frontend:

```bash
pnpm install
pnpm dev
```

Frontend URL: `http://localhost:5173`

## Current Feature Status

- Authentication (sign in, sign up, session sync with `me`): available
- Public and protected routing: available
- Authenticated routes: `/dashboard`, `/transactions`, `/categories`, `/profile`
- Dashboard, transactions, and categories pages: available and under active UI iteration

## Project Structure

- `src/pages`: application pages
- `src/router`: routing and route guards
- `src/lib/graphql`: Apollo client, queries, and mutations
- `src/stores`: global state stores
- `src/components`: reusable UI components

## Scripts

```bash
pnpm dev          # start Vite development server
pnpm build        # run TypeScript build and create production bundle
pnpm preview      # preview production bundle locally
pnpm format       # format code with Biome
pnpm lint         # run biome check
pnpm lint:biome   # run biome lint
pnpm check:biome  # run biome check
```
