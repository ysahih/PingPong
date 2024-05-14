export declare class TwoFactorAuthenticationService {
    generateTwoFactorAuthenticationSecret(username: string): Promise<{
        secret: string;
        qrCodeData: string;
    }>;
    isTwoFactorAuthenticationCodeValid(secret: string, token: string): Promise<boolean>;
}
