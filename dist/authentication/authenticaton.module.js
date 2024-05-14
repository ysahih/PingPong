"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMod = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const Google_Strategy_1 = require("./googleStategy/Google.Strategy");
const intra_Srategy_1 = require("./intraStrategy/intra.Srategy");
const jwt_1 = require("@nestjs/jwt");
const jwtStrategy_1 = require("./jwtStrategy/jwtStrategy");
const _2fa_1 = require("./2fa/2fa");
const cloudinary_service_1 = require("./cloudinary.service");
let AuthMod = class AuthMod {
};
exports.AuthMod = AuthMod;
exports.AuthMod = AuthMod = __decorate([
    (0, common_1.Module)({
        imports: [jwt_1.JwtModule],
        controllers: [auth_controller_1.authController],
        providers: [auth_service_1.authService, Google_Strategy_1.GoogleStregy, intra_Srategy_1.IntraStrategy, jwtStrategy_1.JwtStrategy, _2fa_1.TwoFactorAuthenticationService, cloudinary_service_1.cloudinaryService]
    })
], AuthMod);
//# sourceMappingURL=authenticaton.module.js.map