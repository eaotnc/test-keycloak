"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type Keycloak from "keycloak-js";
import { getKeycloak } from "@/lib/keycloak";

interface UserProfile {
  username?: string;
  name?: string;
  email?: string;
  roles: string[];
}

interface AuthContextValue {
  initialized: boolean;
  authenticated: boolean;
  token?: string;
  user: UserProfile | null;
  keycloak: Keycloak | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  initialized: false,
  authenticated: false,
  user: null,
  keycloak: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState<string | undefined>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const keycloakRef = useRef<Keycloak | null>(null);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const keycloak = getKeycloak();
    keycloakRef.current = keycloak;

    keycloak
      .init({
        onLoad: "check-sso",
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
        pkceMethod: "S256",
      })
      .then((auth) => {
        setAuthenticated(auth);
        setInitialized(true);
        if (auth) {
          setToken(keycloak.token);
          const parsed = keycloak.tokenParsed as
            | Record<string, unknown>
            | undefined;
          setUser({
            username: keycloak.tokenParsed?.preferred_username as string,
            name: parsed?.name as string,
            email: parsed?.email as string,
            roles: (keycloak.realmAccess?.roles ?? []) as string[],
          });
        }
      })
      .catch(() => setInitialized(true));

    keycloak.onTokenExpired = () => {
      keycloak.updateToken(30).then(() => setToken(keycloak.token));
    };
  }, []);

  const login = () => keycloakRef.current?.login();
  const logout = () =>
    keycloakRef.current?.logout({ redirectUri: window.location.origin });

  return (
    <AuthContext.Provider
      value={{
        initialized,
        authenticated,
        token,
        user,
        keycloak: keycloakRef.current,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
