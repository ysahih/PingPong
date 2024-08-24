import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';

@Injectable()
export class TwoFactorAuthenticationService {
    async generateTwoFactorAuthenticationSecret(username: string) {
        const secret = authenticator.generateSecret();
        const otpauthUrl = authenticator.keyuri(username, 'PONGy', secret);
        const qrCodeData = await qrcode.toDataURL(otpauthUrl);
        return { secret, qrCodeData };
    }

    async isTwoFactorAuthenticationCodeValid(secret: string, token: string) {
        return authenticator.verify({ secret, token });
    }
}