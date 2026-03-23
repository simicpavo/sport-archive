/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import jwksRsa from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface KeycloakJwtPayload {
  sub: string;
  preferred_username?: string;
  email?: string;
  realm_access?: { roles: string[] };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const issuer = process.env.KEYCLOAK_ISSUER!;
    const jwksUri = process.env.KEYCLOAK_JWKS_URI!;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri,
      }),
      algorithms: ['RS256'],
      issuer,
    });
  }

  validate(payload: KeycloakJwtPayload) {
    return {
      userId: payload.sub,
      username: payload.preferred_username,
      email: payload.email,
      roles: payload.realm_access?.roles ?? [],
      raw: payload,
    };
  }
}
