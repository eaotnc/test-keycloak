import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  decodeUser,
  isExpired,
  refreshGrant,
} from "@/lib/keycloakServer";
import { setAuthCookies, clearAuthCookies } from "@/lib/authCookies";

export async function GET() {
  const store = await cookies();
  const accessToken = store.get(ACCESS_COOKIE)?.value;
  const refreshToken = store.get(REFRESH_COOKIE)?.value;

  // Valid, unexpired access token → return the user directly.
  if (accessToken) {
    const user = decodeUser(accessToken);
    if (user && !isExpired(user.exp)) {
      return NextResponse.json({ authenticated: true, user });
    }
  }

  // Access token missing/expired but we have a refresh token → try to refresh.
  if (refreshToken) {
    const refreshed = await refreshGrant(refreshToken);
    if (refreshed.ok) {
      const user = decodeUser(refreshed.tokens.access_token);
      const res = NextResponse.json({ authenticated: true, user });
      setAuthCookies(res, refreshed.tokens);
      return res;
    }
  }

  // Not authenticated → clear any stale cookies.
  const res = NextResponse.json({ authenticated: false, user: null });
  clearAuthCookies(res);
  return res;
}
