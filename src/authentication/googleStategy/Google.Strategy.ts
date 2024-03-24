import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { authService } from "../auth.service";
import { JwtService } from "@nestjs/jwt";
import { generateJwtToken } from "../jwtStrategy/jwtToken";

@Injectable()
export class GoogleStregy extends PassportStrategy(Strategy){
    constructor(private Auth: authService, private jwtService: JwtService){
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_URL,
            scope: ['email', 'Profile'],
        })
    }
    async validate(accessToken: string, refreshToken: string, profile: Profile, done: Function){
        // console.log(accessToken);
        // console.log(refreshToken);
        // console.log(profile.photos[0].value);
        const user = await this.Auth.ValideteUser(profile.emails[0].value, profile.displayName, profile.photos[0].value, profile.name.givenName, profile.name.familyName);
        console.log(user);
        // const payload = { email: user.email, sub: user.id };
        const jwt = generateJwtToken(user);
        const users = {
            user,
            jwt: jwt,
        }
        done(null, users);
    }
}