# NestJS api-service for Acme Back Office

Business API backed by PostgreSQL and secured with Keycloak JWT validation.

## Endpoints

All routes except `GET /api/health` require `Authorization: Bearer <access_token>`.

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/api/health` | public | Health check |
| GET | `/api/dashboard/stats` | any authenticated | Dashboard stat cards |
| GET | `/api/dashboard/revenue` | any authenticated | Monthly revenue chart data |
| GET | `/api/dashboard/goals` | any authenticated | Goal progress bars |
| GET | `/api/orders` | any authenticated | All orders |
| GET | `/api/users` | `admin` | Team users list |

## Prerequisites

From the repository root:

```bash
docker compose up -d
```

This starts Keycloak and **app-postgres** (port `5433`).

## Setup

```bash
cd api-service
npm install
cp .env.example .env   # if needed
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
```

API runs at [http://localhost:4000](http://localhost:4000).

## Environment

| Variable | Default |
|----------|---------|
| `PORT` | `4000` |
| `DATABASE_URL` | `postgresql://acme:acme@localhost:5433/acme` |
| `KEYCLOAK_URL` | `http://localhost:8080` |
| `KEYCLOAK_REALM` | `myapp` |

## Auth flow

1. User logs in via `back-office` → Keycloak issues JWT
2. Next.js BFF stores token in httpOnly cookie
3. Browser calls `/api/data/*` on Next.js
4. Next.js forwards `Bearer` token to this service
5. NestJS verifies JWT signature against Keycloak JWKS

## Scripts

```bash
npm run start:dev    # dev server with watch
npm run db:migrate   # prisma migrate dev
npm run db:seed      # seed mock data into postgres
npm run db:reset     # reset DB + re-seed
```
