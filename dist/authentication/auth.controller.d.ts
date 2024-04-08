/// <reference types="cookie-parser" />
/// <reference types="multer" />
import { authService } from "./auth.service";
import { Request, Response } from "express";
import { LoginData, signupData } from "./dto/form";
import { cloudinaryService } from "./cloudinary.service";
export declare class authController {
    private authS;
    private cloudinaryService;
    private readonly FrontEndUrl;
    private readonly BackEndUrl;
    constructor(authS: authService, cloudinaryService: cloudinaryService);
    generateTwoFactorAuthenticationSecret(req: Request, res: Response): Promise<void>;
    disableTwoFactorAuthenticationCode(req: Request, token: string, res: Response): Promise<void>;
    enableTwoFactorAuthenticationCode(req: Request, token: string, res: Response): Promise<void>;
    verifyTwoFactorAuthenticationCode(req: Request, token: string, res: Response): Promise<void>;
    loginn(req: LoginData, response: Response): Promise<void>;
    signup(req: signupData, response: Response): Promise<void>;
    googlesignup(req: Request, response: Response): void;
    intraLogin(request: Request, response: Response): void;
    user(request: Request, res: Response): Promise<void>;
    home(request: Request, res: Response): Promise<void>;
    uploadFile(file: Express.Multer.File, image: string, userName: string, req: Request, password: string, res: Response): Promise<void>;
}
