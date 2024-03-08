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
          // console.log('request', request.headers?.authorization?.split(' ')[1]);
          // console.log(request);
          // return request.headers?.authorization?.split(' ')[1];
          // request.Autarization;
          return request?.cookies?.jwt? request.cookies.jwt : request.headers?.authorization?.split(' ')[1];
        },
      ])
,
      secretOrKey: 'essadike',
    });
  }

  async validate(payload: any) {
    // Perform any additional validation or database lookup based on the extracted payload
    return { userId: payload.id, email: payload.email, userName: payload.userName};
  }
}