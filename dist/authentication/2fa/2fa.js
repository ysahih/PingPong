"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorAuthenticationService = void 0;
const common_1 = require("@nestjs/common");
const otplib_1 = require("otplib");
const qrcode = require("qrcode");
let TwoFactorAuthenticationService = class TwoFactorAuthenticationService {
    async generateTwoFactorAuthenticationSecret(username) {
        const secret = otplib_1.authenticator.generateSecret();
        const otpauthUrl = otplib_1.authenticator.keyuri(username, 'PONGy', secret);
        const qrCodeData = await qrcode.toDataURL(otpauthUrl);
        return { secret, qrCodeData };
    }
    async isTwoFactorAuthenticationCodeValid(secret, token) {
        return otplib_1.authenticator.verify({ secret, token });
    }
};
exports.TwoFactorAuthenticationService = TwoFactorAuthenticationService;
exports.TwoFactorAuthenticationService = TwoFactorAuthenticationService = __decorate([
    (0, common_1.Injectable)()
], TwoFactorAuthenticationService);
//# sourceMappingURL=2fa.js.map