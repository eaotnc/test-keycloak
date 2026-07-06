# Keycloak (Docker) + Next.js Back Office + NestJS API

A local [Keycloak](https://www.keycloak.org/) `26.6.4` setup with Docker Compose, a **Next.js back office** (BFF + UI), and a **NestJS API** backed by PostgreSQL.

| Folder | Stack | Role |
|--------|-------|------|
| `docker-compose.yml` | Keycloak + Postgres ×2 | Auth + app database |
| `back-office/` | Next.js 16, Ant Design | Admin UI + login/session (BFF) |
| `api-service/` | NestJS, Prisma, Postgres | Business API (orders, users, dashboard) |

The imported `myapp` realm includes a confidential `back-office` client and a demo user (`demo` / `demo`).

## Quick start (full stack)

```bash
# 1. Start Keycloak + databases
docker compose up -d

# 2. Set up and run the API (first time only)
cd api-service
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev

# 3. Run the back office (new terminal)
cd back-office
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with **`demo` / `demo`**.

- Keycloak admin: [http://localhost:8080/admin](http://localhost:8080/admin) (`admin` / `admin`)
- API health: [http://localhost:4000/api/health](http://localhost:4000/api/health)

See [`back-office/README.md`](./back-office/README.md) and [`api-service/README.md`](./api-service/README.md) for details.

## Common commands

```bash
# Follow logs
docker compose logs -f keycloak

# Stop the stack (keeps data)
docker compose down

# Stop and delete all data (fresh start)
docker compose down -v

# Restart after config changes
docker compose up -d
```

## Configuration

All settings live in `.env`:

| Variable                  | Description                        | Default    |
| ------------------------- | ---------------------------------- | ---------- |
| `KEYCLOAK_ADMIN`          | Admin console username             | `admin`    |
| `KEYCLOAK_ADMIN_PASSWORD` | Admin console password             | `admin`    |
| `KEYCLOAK_PORT`           | Host port for Keycloak             | `8080`     |
| `POSTGRES_DB`             | Database name                      | `keycloak` |
| `POSTGRES_USER`           | Database user                      | `keycloak` |
| `POSTGRES_PASSWORD`       | Database password                  | `keycloak` |

The admin user is created only on the **first** startup (when the database is empty). To change it later, do so from the admin console or reset with `docker compose down -v`.

## Notes

- This runs Keycloak in `start-dev` mode, which is intended for local development and testing only. Do **not** use `start-dev` or the default credentials in production.
- Data persists in the `postgres_data` Docker volume across restarts.
- For a production setup you would run `start` (not `start-dev`), configure a proper hostname, and terminate TLS. See the [Keycloak container guide](https://www.keycloak.org/server/containers).
