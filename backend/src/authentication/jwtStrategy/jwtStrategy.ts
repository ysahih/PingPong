import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      tryCatch: true,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // console.log(request);
          return request?.cookies?.jwt;
        },
      ])
,
      secretOrKey: 'essadike',
    });
  }

  async validate(payload: any) {
    // Perform any additional validation or database lookup based on the extracted payload
    return { userId: payload.id, email: payload.email,  };
  }
}