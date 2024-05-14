/// <reference types="passport-oauth2" />
import { authService } from "../auth.service";
declare const IntraStrategy_base: new (...args: any[]) => import("passport-oauth2");
export declare class IntraStrategy extends IntraStrategy_base {
    private AuthS;
    constructor(AuthS: authService);
    validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any>;
}
export {};
