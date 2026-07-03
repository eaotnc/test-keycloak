# Acme Back Office

A mockup admin back office built with **Next.js 16 (App Router)**, **Ant Design v6**, and **Tailwind CSS v4**, secured with **Keycloak** using a **Backend-for-Frontend (BFF)** login flow — a custom in-app login form that authenticates against Keycloak's token API server-side, with tokens stored in httpOnly cookies.

## Features

- Custom in-app login page (no redirect to Keycloak's hosted login)
- Server-side auth via Keycloak's Direct Access Grants (password grant), proxied through Next.js API routes
- Tokens kept in **httpOnly cookies** — never exposed to browser JavaScript
- Automatic access-token refresh using the refresh token
- Protected app shell with collapsible sidebar and user menu
- Dashboard with stat cards, a revenue chart, goals, and recent orders
- Users and Orders tables (search, filter, sort, pagination)
- Settings page showing live profile + realm roles decoded from the token

## Prerequisites

Keycloak must be running with the `myapp` realm imported. From the repository root:

```bash
docker compose up -d
```

This starts Keycloak on `http://localhost:8080` and imports the `myapp` realm, the confidential `back-office` client (Direct Access Grants enabled), and a demo user.

## Run the app

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with the custom login form.

**Demo user:** `demo` / `demo`

## Configuration

Server-side Keycloak settings live in `.env.local` (no `NEXT_PUBLIC_` prefix — these stay on the server):

| Variable                 | Default                        |
| ------------------------ | ------------------------------ |
| `KEYCLOAK_URL`           | `http://localhost:8080`        |
| `KEYCLOAK_REALM`         | `myapp`                        |
| `KEYCLOAK_CLIENT_ID`     | `back-office`                  |
| `KEYCLOAK_CLIENT_SECRET` | `back-office-secret-change-me` |

## How auth is wired

- `src/lib/keycloakServer.ts` — server-only helpers: `passwordGrant`, `refreshGrant`, `endSession`, and JWT decoding.
- `src/lib/authCookies.ts` — sets/clears the httpOnly `kc_access_token` and `kc_refresh_token` cookies.
- `src/app/api/auth/login/route.ts` — exchanges username/password for tokens, sets cookies.
- `src/app/api/auth/session/route.ts` — returns the current user; auto-refreshes an expired access token using the refresh token.
- `src/app/api/auth/logout/route.ts` — revokes the session at Keycloak and clears cookies.
- `src/providers/AuthProvider.tsx` — client `useAuth()` hook: `authenticated`, `user`, `login(username, password)`, `logout()`.
- `src/app/login/page.tsx` — the custom Ant Design login form.
- `src/components/AppShell.tsx` — guards routes: loader while checking the session, redirect to `/login` when logged out, dashboard shell when authenticated.

## Calling a protected backend

Because tokens live in httpOnly cookies, the browser can't read them. Call your downstream API through a Next.js route handler (server-side), reading the access token from the cookie and forwarding it as a bearer header:

```ts
import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "@/lib/keycloakServer";

const token = (await cookies()).get(ACCESS_COOKIE)?.value;
await fetch("https://api.example.com/data", {
  headers: { Authorization: `Bearer ${token}` },
});
```

## Security notes

- The **password grant is deprecated in OAuth 2.1** and can't support MFA, social login, or identity brokering, since this app handles the raw password. Keycloak's recommended flow is the hosted-login redirect (Authorization Code + PKCE). Use this custom-form approach only when you specifically need an in-app login form.
- `keycloakServer.ts` decodes the JWT without verifying its signature (the token comes directly from Keycloak over a trusted server-to-server call). For a hardened setup, verify against the realm JWKS (e.g. with `jose`).
- Change `KEYCLOAK_CLIENT_SECRET` (and the matching value in `keycloak/import/myapp-realm.json`) before using anywhere real.
