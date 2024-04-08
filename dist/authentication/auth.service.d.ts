import { prismaService } from "src/prisma/prisma.service";
import { LoginData, signupData } from "./dto/form";
import { TwoFactorAuthenticationService } from "./2fa/2fa";
export declare class authService {
    private prism;
    private Twofa;
    constructor(prism: prismaService, Twofa: TwoFactorAuthenticationService);
    generateUniqueUsername(baseUsername: string): Promise<string>;
    generateTwoFactorAuthentication(userName: string): Promise<string | {
        error: string;
    }>;
    enableTwofactor(id: number, token: string): Promise<{
        message: string;
        status: boolean;
    }>;
    disableTwofactor(id: number, token: string): Promise<{
        message: string;
        status: boolean;
    }>;
    verifyTwofactor(id: number, token: string): Promise<boolean>;
    Changedata(id: number, image: string, userName: string, password: string): Promise<{
        user: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userName: string;
            email: string;
            hash: string;
            image: string;
            firstName: string;
            secret: string;
            twoFa: boolean;
            twofaCheck: boolean;
            lastName: string;
            token: boolean;
            online: boolean;
            update: boolean;
        };
        error?: undefined;
    } | {
        error: any;
        user?: undefined;
    }>;
    signup(req: signupData): Promise<{
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userName: string;
            email: string;
            hash: string;
            image: string;
            firstName: string;
            secret: string;
            twoFa: boolean;
            twofaCheck: boolean;
            lastName: string;
            token: boolean;
            online: boolean;
            update: boolean;
        };
        error?: undefined;
    } | {
        error: any;
        data?: undefined;
    }>;
    findUserCallbak(id: number): Promise<{
        email: string;
        userName: string;
        id: number;
        update: boolean;
    } | {
        error: any;
    }>;
    findUser(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userName: string;
        email: string;
        hash: string;
        image: string;
        firstName: string;
        secret: string;
        twoFa: boolean;
        twofaCheck: boolean;
        lastName: string;
        token: boolean;
        online: boolean;
        update: boolean;
    } | {
        error: any;
    }>;
    ValidateToken(id: number, bool: boolean, twoFa: boolean): Promise<void>;
    ValideteUser(email: string, userName: string, image: string, first_name?: string, last_name?: string): Promise<{
        email: string;
        userName: string;
        id: number;
        update: boolean;
    } | {
        error: any;
    }>;
    signin(req: LoginData): Promise<{
        user: {
            email: string;
            userName: string;
            id: number;
            hash: string;
            update: boolean;
        };
        error?: undefined;
    } | {
        error: any;
        user?: undefined;
    }>;
}
