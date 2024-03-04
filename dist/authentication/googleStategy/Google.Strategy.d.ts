import { Profile, Strategy } from "passport-google-oauth20";
import { authService } from "../auth.service";
import { JwtService } from "@nestjs/jwt";
declare const GoogleStregy_base: new (...args: any[]) => Strategy;
export declare class GoogleStregy extends GoogleStregy_base {
    private Auth;
    private jwtService;
    constructor(Auth: authService, jwtService: JwtService);
    validate(accessToken: string, refreshToken: string, profile: Profile, done: Function): Promise<void>;
}
export {};
