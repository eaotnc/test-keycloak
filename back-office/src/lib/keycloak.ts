import Keycloak from "keycloak-js";

let keycloakInstance: Keycloak | null = null;

export function getKeycloak(): Keycloak {
  if (!keycloakInstance) {
    keycloakInstance = new Keycloak({
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL ?? "http://localhost:8080",
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM ?? "myapp",
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? "react-app",
    });
  }
  return keycloakInstance;
}
