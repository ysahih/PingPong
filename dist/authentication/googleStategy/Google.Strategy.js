"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleStregy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const auth_service_1 = require("../auth.service");
const jwt_1 = require("@nestjs/jwt");
const jwtToken_1 = require("../jwtStrategy/jwtToken");
let GoogleStregy = class GoogleStregy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy) {
    constructor(Auth, jwtService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_URL,
            scope: ['email', 'Profile'],
        });
        this.Auth = Auth;
        this.jwtService = jwtService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        const user = await this.Auth.ValideteUser(profile.emails[0].value, profile.displayName, profile.photos[0].value, profile.name.givenName, profile.name.familyName);
        console.log(user);
        const jwt = (0, jwtToken_1.generateJwtToken)(user);
        const users = {
            user,
            jwt: jwt,
        };
        done(null, users);
    }
};
exports.GoogleStregy = GoogleStregy;
exports.GoogleStregy = GoogleStregy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.authService, jwt_1.JwtService])
], GoogleStregy);
//# sourceMappingURL=Google.Strategy.js.map