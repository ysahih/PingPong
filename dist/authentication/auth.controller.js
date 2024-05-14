"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const form_1 = require("./dto/form");
const passport_1 = require("@nestjs/passport");
const jwtguards_1 = require("./jwtStrategy/jwtguards");
const jwtToken_1 = require("./jwtStrategy/jwtToken");
const platform_express_1 = require("@nestjs/platform-express");
const cloudinary_service_1 = require("./cloudinary.service");
let authController = class authController {
    constructor(authS, cloudinaryService) {
        this.authS = authS;
        this.cloudinaryService = cloudinaryService;
        this.FrontEndUrl = process.env.FRONTEND_URL;
        this.BackEndUrl = process.env.BACKEND_URL;
    }
    async generateTwoFactorAuthenticationSecret(req, res) {
        console.log(req.user);
        const src = await this.authS.generateTwoFactorAuthentication(req.user["userName"]);
        console.log(src);
        res.json(src);
    }
    async disableTwoFactorAuthenticationCode(req, token, res) {
        console.log(token);
        const valid = await this.authS.disableTwofactor(req.user["userId"], token);
        res.json(valid);
    }
    async enableTwoFactorAuthenticationCode(req, token, res) {
        console.log(token);
        const valid = await this.authS.enableTwofactor(req.user["userId"], token);
        res.json(valid);
    }
    async verifyTwoFactorAuthenticationCode(req, token, res) {
        console.log(token);
        const valid = await this.authS.verifyTwofactor(req.user["userId"], token);
        if (valid)
            await this.authS.ValidateToken(req.user["userId"], true, true);
        res.json(valid);
    }
    async loginn(req, response) {
        const user = await this.authS.signin(req);
        if (user.error)
            response.status(400).json(user);
        else
            response.cookie("jwt", (0, jwtToken_1.generateJwtToken)(user.user), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            }).send({ login: "login success !" });
    }
    async signup(req, response) {
        const user = await this.authS.signup(req);
        console.log("user", req, user);
        if (user.error)
            response.status(400).json(user.error);
        else
            response
                .cookie("jwt", (0, jwtToken_1.generateJwtToken)(user.data), {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            })
                .send(user.data);
    }
    googlesignup(req, response) {
        response
            .cookie("jwt", req.user["jwt"], {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
            .redirect(this.FrontEndUrl);
    }
    intraLogin(request, response) {
        try {
            response
                .cookie("jwt", request.user, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            })
                .redirect(this.FrontEndUrl);
        }
        catch (error) {
            response.status(400).json({ error: error });
        }
    }
    async user(request, res) {
        const user = await this.authS.findUser(request.user["userId"]);
        console.log(request.user["userId"]);
        user
            ? res.json(user)
            : res.status(404).json({
                statusCode: 404,
            });
    }
    async home(request, res) {
        await this.authS.ValidateToken(request.user["userId"], false, false);
        res
            .clearCookie("jwt", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
            .send({ logout: "logout success !" });
    }
    async uploadFile(file, image, userName, req, password, res) {
        try {
            console.log(file);
            const ImgUrl = await this.cloudinaryService.uploadImage(file);
            console.log('Imgae----------:  ', ImgUrl);
            const base64DataURI = ImgUrl;
            const user = await this.authS.Changedata(req.user["userId"], base64DataURI, userName, password);
            console.log(user);
            if (user.error)
                res.status(400).json(user.error);
            else {
                const data = {
                    id: user.user.id,
                    email: user.user.email,
                    userName: user.user.userName,
                    update: user.user.update,
                };
                res
                    .cookie("jwt", (0, jwtToken_1.generateJwtToken)(data), {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                })
                    .send("ok");
            }
        }
        catch (error) {
            if (!image)
                res.status(400).json({ error: "image is required" });
            const user = await this.authS.Changedata(req.user["userId"], image, userName, password);
            if (user.error)
                res.status(400).json(user.error);
            else {
                const data = {
                    id: user.user.id,
                    email: user.user.email,
                    userName: user.user.userName,
                    update: user.user.update,
                };
                res
                    .cookie("jwt", (0, jwtToken_1.generateJwtToken)(data), {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                })
                    .send("ok");
            }
        }
    }
};
exports.authController = authController;
__decorate([
    (0, common_1.Get)("generate-2fa"),
    (0, common_1.UseGuards)(jwtguards_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], authController.prototype, "generateTwoFactorAuthenticationSecret", null);
__decorate([
    (0, common_1.Post)("disable-2fa"),
    (0, common_1.UseGuards)(jwtguards_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)("token")),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], authController.prototype, "disableTwoFactorAuthenticationCode", null);
__decorate([
    (0, common_1.Post)("enable-2fa"),
    (0, common_1.UseGuards)(jwtguards_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)("token")),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], authController.prototype, "enableTwoFactorAuthenticationCode", null);
__decorate([
    (0, common_1.Post)("verify-2fa"),
    (0, common_1.UseGuards)(jwtguards_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)("token")),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], authController.prototype, "verifyTwoFactorAuthenticationCode", null);
__decorate([
    (0, common_1.Post)("signin"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [form_1.LoginData, Object]),
    __metadata("design:returntype", Promise)
], authController.prototype, "loginn", null);
__decorate([
    (0, common_1.Post)("signup"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [form_1.signupData, Object]),
    __metadata("design:returntype", Promise)
], authController.prototype, "signup", null);
__decorate([
    (0, common_1.Get)("api/auth/google"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("google")),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], authController.prototype, "googlesignup", null);
__decorate([
    (0, common_1.Get)("api/auth/intra"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("intra")),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], authController.prototype, "intraLogin", null);
__decorate([
    (0, common_1.Get)("profile"),
    (0, common_1.UseGuards)(jwtguards_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], authController.prototype, "user", null);
__decorate([
    (0, common_1.Get)("logout"),
    (0, common_1.UseGuards)(jwtguards_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], authController.prototype, "home", null);
__decorate([
    (0, common_1.Put)("/update"),
    (0, common_1.UseGuards)(jwtguards_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)("image")),
    __param(2, (0, common_1.Body)("userName")),
    __param(3, (0, common_1.Req)()),
    __param(4, (0, common_1.Body)("Password")),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object, String, Object]),
    __metadata("design:returntype", Promise)
], authController.prototype, "uploadFile", null);
exports.authController = authController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [auth_service_1.authService, cloudinary_service_1.cloudinaryService])
], authController);
//# sourceMappingURL=auth.controller.js.map