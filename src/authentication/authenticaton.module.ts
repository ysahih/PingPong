import { Module } from "@nestjs/common";
import { authController } from "./auth.controller";
import { authService } from "./auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { GoogleStregy } from "./googleStategy/Google.Strategy";
import { IntraStrategy } from "./intraStrategy/intra.Srategy";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwtStrategy/jwtStrategy";
import { TwoFactorAuthenticationService } from "./2fa/2fa";
import { cloudinaryService } from "./cloudinary.service";


@Module({
    imports: [JwtModule],
    controllers: [authController],
    providers: [authService, GoogleStregy, IntraStrategy, JwtStrategy, TwoFactorAuthenticationService, cloudinaryService]
})
export class AuthMod{}
