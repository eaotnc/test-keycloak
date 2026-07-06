import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { IS_PUBLIC_KEY } from "./public.decorator";

export type AuthUser = JWTPayload & {
  preferred_username?: string;
  email?: string;
  name?: string;
  realm_access?: { roles?: string[] };
};

@Injectable()
export class KeycloakAuthGuard implements CanActivate {
  private jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
  private issuer = "";

  constructor(
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
  ) {
    const url = this.config.getOrThrow<string>("KEYCLOAK_URL");
    const realm = this.config.getOrThrow<string>("KEYCLOAK_REALM");
    this.issuer = `${url}/realms/${realm}`;
    this.jwks = createRemoteJWKSet(
      new URL(`${this.issuer}/protocol/openid-connect/certs`),
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      user?: AuthUser;
    }>();

    const header = request.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing bearer token");
    }

    try {
      const { payload } = await jwtVerify(header.slice(7), this.jwks!, {
        issuer: this.issuer,
      });
      request.user = payload as AuthUser;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
