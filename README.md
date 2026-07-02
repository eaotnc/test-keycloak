# Keycloak (Docker)

A local [Keycloak](https://www.keycloak.org/) `26.6.4` setup running in development mode with a persistent PostgreSQL 16 database, orchestrated with Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with the Compose plugin (`docker compose`).

## Quick start

1. (Optional) Review and edit credentials in `.env`.
2. Start the stack:

```bash
docker compose up -d
```

3. Open the admin console at [http://localhost:8080](http://localhost:8080) and log in with the credentials from `.env` (default `admin` / `admin`).

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
