import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-oauth2";
import axios from "axios";
import { authService } from "../auth.service";
import { generateJwtToken } from "../jwtStrategy/jwtToken";
import * as fs from "fs";
@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, "intra") {
  constructor(private AuthS: authService) {
    super({
      authorizationURL: "https://api.intra.42.fr/oauth/authorize", // 42's authorization endpoint
      tokenURL: "https://api.intra.42.fr/oauth/token",
      clientID: process.env.INTRA_CLIENT_ID,
      clientSecret: process.env.INTRA_CLIENT_SECRET,
      callbackURL: process.env.INTRA_URL,
      scopes: ["public"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function
  ): Promise<any> {
    try {
      const profileResponse = await axios.get("https://api.intra.42.fr/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}`},
      });
      const profile2 = profileResponse.data;
      
      // fs.writeFileSync("profile.json", JSON.stringify(profile2, null, 2));
      // console.log(profile2.email, profile2.login, profile2.image.link);
      const user = await this.AuthS.ValideteUser(
        profile2.email,
        profile2.login,
        profile2.image.link,
        profile2.first_name,
        profile2.last_name,
      );
      const token: string = generateJwtToken(user);
      return done(null, token);
    } catch (error) {
      return done(error, null);
    }
  }
}
