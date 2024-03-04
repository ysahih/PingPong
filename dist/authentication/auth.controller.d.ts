/// <reference types="multer" />
import { authService } from "./auth.service";
import { Request, Response } from 'express';
import { LoginData, signupData } from "./dto/form";
export declare class authController {
    private authS;
    private readonly BackendUrl;
    constructor(authS: authService);
    loginn(req: LoginData, response: Response): Promise<void>;
    signup(req: signupData, response: Response): Promise<void>;
    googlesignup(req: Request, response: Response): void;
    intraLogin(request: Request, response: Response): void;
    user(request: Request, res: Response): Promise<void>;
    home(request: Request, res: Response): Promise<void>;
    uploadFile(file: Express.Multer.File, image: string, userName: string, req: Request, password: string, res: Response): Promise<void>;
}
