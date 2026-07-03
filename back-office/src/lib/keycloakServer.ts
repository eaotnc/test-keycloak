import "server-only";

const KEYCLOAK_URL = process.env.KEYCLOAK_URL ?? "http://localhost:8080";
const REALM = process.env.KEYCLOAK_REALM ?? "myapp";
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID ?? "back-office";
const CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET ?? "";

const OIDC_BASE = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect`;

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
}

export interface DecodedUser {
  username?: string;
  name?: string;
  email?: string;
  roles: string[];
  exp?: number;
}

export const ACCESS_COOKIE = "kc_access_token";
export const REFRESH_COOKIE = "kc_refresh_token";

function clientCredentials(): Record<string, string> {
  return { client_id: CLIENT_ID, client_secret: CLIENT_SECRET };
}

/**
 * Exchange username/password for tokens using the Direct Access Grants
 * (Resource Owner Password Credentials) flow. Runs server-side only.
 */
export async function passwordGrant(
  username: string,
  password: string,
): Promise<{ ok: true; tokens: TokenResponse } | { ok: false; error: string }> {
  const res = await fetch(`${OIDC_BASE}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "password",
      ...clientCredentials(),
      username,
      password,
      scope: "openid",
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    // Keycloak returns 401 with { error, error_description } on bad credentials.
    const data = await res.json().catch(() => ({}));
    return {
      ok: false,
      error:
        (data as { error_description?: string }).error_description ??
        "Invalid username or password",
    };
  }

  return { ok: true, tokens: (await res.json()) as TokenResponse };
}

/** Use a refresh token to obtain a fresh set of tokens. */
export async function refreshGrant(
  refreshToken: string,
): Promise<{ ok: true; tokens: TokenResponse } | { ok: false }> {
  const res = await fetch(`${OIDC_BASE}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      ...clientCredentials(),
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  if (!res.ok) return { ok: false };
  return { ok: true, tokens: (await res.json()) as TokenResponse };
}

/** Revoke the session at Keycloak (back-channel logout). */
export async function endSession(refreshToken: string): Promise<void> {
  await fetch(`${OIDC_BASE}/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      ...clientCredentials(),
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  }).catch(() => {});
}

/**
 * Decode a JWT payload without verifying the signature.
 *
 * This is acceptable here because the token was obtained directly from
 * Keycloak over a trusted server-to-server call and is only used to render
 * profile info. For a hardened setup, verify the signature against the realm
 * JWKS (e.g. with the `jose` library) before trusting any claims.
 */
export function decodeUser(accessToken: string): DecodedUser | null {
  try {
    const payload = accessToken.split(".")[1];
    const json = Buffer.from(payload, "base64url").toString("utf8");
    const claims = JSON.parse(json) as {
      preferred_username?: string;
      name?: string;
      email?: string;
      exp?: number;
      realm_access?: { roles?: string[] };
    };
    return {
      username: claims.preferred_username,
      name: claims.name,
      email: claims.email,
      exp: claims.exp,
      roles: claims.realm_access?.roles ?? [],
    };
  } catch {
    return null;
  }
}

export function isExpired(exp?: number, skewSeconds = 10): boolean {
  if (!exp) return true;
  return Date.now() / 1000 >= exp - skewSeconds;
}
