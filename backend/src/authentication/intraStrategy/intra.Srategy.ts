
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-oauth2";
import axios from 'axios';
import { authService } from "../auth.service";
import { generateJwtToken } from "../jwtStrategy/jwtToken";

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, 'intra') {
    // ... existing constructor ...
    constructor(private AuthS: authService){
        super({
            authorizationURL: 'https://api.intra.42.fr/oauth/authorize', // 42's authorization endpoint
            tokenURL: 'https://api.intra.42.fr/oauth/token',
            clientID: process.env.INTRA_CLIENT_ID,
            clientSecret: process.env.INTRA_CLIENT_SECRET,
            callbackURL: process.env.INTRA_URL,
            scopes:["public"]
        })
    };
    // Method to refresh the access token
    // async refreshToken(refreshToken: string): Promise<string> {
    //     const tokenResponse = await axios.post('https://api.intra.42.fr/oauth/token', {
    //         client_id: process.env.INTRA_CLIENT_ID,
    //         client_secret: process.env.INTRA_CLIENT_SECRET,
    //         refresh_token: refreshToken,
    //         grant_type: 'refresh_token',
    //     });
    //     return tokenResponse.data.access_token;
    // }

    async validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any> {

        const profileResponse = await axios.get('https://api.intra.42.fr/v2/me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        // console.log(accessToken);
        const profile2 = profileResponse.data;
        // console.log(profile2.email, profile2.login, profile2.image.link);
        const user = await this.AuthS.ValideteUser(profile2.email, profile2.login, profile2.image.link);
        const token: string = generateJwtToken(user);
        // const fs = require('fs');
        // // // Log user data
        // const outputFilePath = 'user_profile11.json'; // Specify the file path
        // fs.writeFileSync(outputFilePath, JSON.stringify(profile2, null, 2));
        return done(null, token);
        // try {
        //     let profileResponse = await axios.get('https://api.intra.42.fr/v2/me', {
        //         headers: { Authorization: `Bearer ${accessToken}` }
        //     });

        //     // ... existing logic ...

        //     return done(null, profile);
        // } catch (error) {
        //     if (error.response && error.response.status === 401) {
        //         // Token expired, refresh it
        //         const newAccessToken = await this.refreshToken(refreshToken);
        //         // Retry the request with the new token
        //         const profileResponse = await axios.get('https://api.intra.42.fr/v2/me', {
        //             headers: { Authorization: `Bearer ${newAccessToken}` }
        //         });

        //         // ... existing logic ...

        //         return done(null, profile);
        //     } else {
        //         // Other errors
        //         return done(error, null);
        //     }
        // }
    }
}



// import { Injectable } from "@nestjs/common";

// import { PassportStrategy } from "@nestjs/passport";
// import { Strategy } from "passport-oauth2";
// import axios from 'axios';
// import { Profile } from "passport";

// @Injectable()
// export class IntraStrategy extends PassportStrategy(Strategy, 'intra') {
//     constructor(){
//         super({
//             authorizationURL: 'https://api.intra.42.fr/oauth/authorize', // 42's authorization endpoint
//             tokenURL: 'https://api.intra.42.fr/oauth/token',
//             clientID: process.env.INTRA_CLIENT_ID,
//             clientSecret: process.env.INTRA_CLIENT_SECRET,
//             callbackURL: process.env.INTRA_URL,
//             redirect_uri: 'home',
//             scopes:["public"]
//         })
//     }
//     async validate(accessToken: string, refreshToken: string, profile: Profile, done: Function): Promise<any> {
//         // Fetch user profile from 42 Intra API
//         const profileResponse = await axios.get('https://api.intra.42.fr/v2/me', {
//             headers: { Authorization: `Bearer ${accessToken}` }
//         });
//         const profile2 = profileResponse.data;

//         const fs = require('fs');
//         // // Log user data
//         const outputFilePath = 'user_profile11.json'; // Specify the file path
//         fs.writeFileSync(outputFilePath, JSON.stringify(profile2, null, 2));

//         // console.log(accessToken);     // Access Token
//         // console.log(refreshToken);
//         // console.log(profile.email);
//         // console.log(profile.image);
//         // console.log(profile);
//         // console.log(profile.first_name, " ", profile.last_name );

//         return done(null, profile);
//         // User profile data
//         // done(null, user);
//     }
// }