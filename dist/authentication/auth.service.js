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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon = require("argon2");
const _2fa_1 = require("./2fa/2fa");
let authService = class authService {
    constructor(prism, Twofa) {
        this.prism = prism;
        this.Twofa = Twofa;
    }
    async generateUniqueUsername(baseUsername) {
        let uniqueUsername = baseUsername;
        let suffix = 0;
        let userExists = true;
        while (userExists) {
            try {
                const user = await this.prism.user.findUnique({
                    where: { userName: uniqueUsername },
                });
                if (!user) {
                    userExists = false;
                }
                else {
                    if (suffix === 0 && !userExists)
                        return uniqueUsername;
                    uniqueUsername = `${baseUsername}${suffix}`;
                    suffix++;
                }
            }
            catch (error) {
                throw new Error("An error occurred while checking for username uniqueness.");
            }
        }
        return uniqueUsername;
    }
    async generateTwoFactorAuthentication(userName) {
        try {
            const check = await this.prism.user.findUnique({
                where: {
                    userName: userName,
                },
                select: {
                    twoFa: true,
                },
            });
            if (check.twoFa)
                return { error: "2fa already enabled" };
            const secret = await this.Twofa.generateTwoFactorAuthenticationSecret(userName);
            if (!secret || !secret.secret || !secret.qrCodeData)
                return null;
            const user = await this.prism.user.update({
                where: {
                    userName: userName,
                },
                data: {
                    secret: secret.secret,
                },
            });
            if (user)
                return secret.qrCodeData;
            else
                return null;
        }
        catch (error) {
            return null;
        }
    }
    async enableTwofactor(id, token) {
        try {
            const userd = await this.prism.user.findUnique({
                where: {
                    id: id,
                },
                select: {
                    secret: true,
                },
            });
            if (!userd || !userd.secret)
                return { message: "2fa not enabled.", status: false };
            const valid = await this.Twofa.isTwoFactorAuthenticationCodeValid(userd.secret, token);
            if (!valid)
                return { message: "2fa not enabled..", status: false };
            const user = await this.prism.user.update({
                where: {
                    id: id,
                },
                data: {
                    twoFa: true,
                    twofaCheck: true,
                },
            });
            if (user)
                return { message: "2fa enabled", status: true };
            else
                return { message: "2fa not enabled...", status: false };
        }
        catch (error) {
            return { message: "something went wrong 2fa not enabled", status: false };
        }
    }
    async disableTwofactor(id, token) {
        try {
            const userd = await this.prism.user.findUnique({
                where: {
                    id: id,
                },
                select: {
                    secret: true,
                    twoFa: true,
                },
            });
            if (userd && !userd.twoFa)
                return { message: "2fa not enabled", status: true };
            if (!userd || !userd.secret || !userd.twoFa)
                return { message: "2fa not disabled", status: false };
            const valid = await this.Twofa.isTwoFactorAuthenticationCodeValid(userd.secret, token);
            if (!valid)
                return { message: "2fa not disabled", status: false };
            const user = await this.prism.user.update({
                where: {
                    id: id,
                },
                data: {
                    twoFa: false,
                },
            });
            if (user)
                return { message: "2fa disabled", status: true };
            else
                return { message: "2fa not disabled", status: false };
        }
        catch (error) {
            return {
                message: "something went wrong 2fa not disabled",
                status: false,
            };
        }
    }
    async verifyTwofactor(id, token) {
        try {
            const user = await this.prism.user.findUnique({
                where: {
                    id,
                },
                select: {
                    secret: true,
                },
            });
            if (!user || !user.secret)
                return false;
            const valid = await this.Twofa.isTwoFactorAuthenticationCodeValid(user.secret, token);
            return valid;
        }
        catch (error) {
            return false;
        }
    }
    async Changedata(id, image, userName, password) {
        try {
            const hash = await argon.hash(password);
            const user = await this.prism.user.update({
                where: {
                    id,
                },
                data: {
                    image,
                    update: true,
                    hash,
                    userName,
                },
            });
            return { user: user };
        }
        catch (error) {
            return { error: error };
        }
    }
    async signup(req) {
        console.log(req);
        try {
            const hash = await argon.hash("req.password");
            const username = await this.generateUniqueUsername(req.firstName);
            console.log(username);
            const data = await this.prism.user.create({
                data: {
                    email: req.email,
                    lastName: req.lastName,
                    firstName: req.firstName,
                    hash: hash,
                    userName: username,
                },
            });
            if (data)
                delete data.hash;
            return { data };
        }
        catch (error) {
            if (error.meta?.target[0])
                return {
                    error: {
                        message: `this ${error.meta?.target[0]} already exist`,
                        target: error.meta?.target[0],
                    },
                };
            else
                return { error: error };
        }
    }
    async findUserCallbak(id) {
        try {
            const user = await this.prism.user.findUnique({
                where: {
                    id,
                },
                select: {
                    id: true,
                    email: true,
                    userName: true,
                    update: true,
                },
            });
            if (user) {
                this.ValidateToken(id, true, false);
            }
            return user || null;
        }
        catch (error) {
            return { error: error };
        }
    }
    async findUser(id) {
        try {
            const user = await this.prism.user.findUnique({
                where: {
                    id,
                },
            });
            if (user) {
                await this.ValidateToken(id, true, undefined);
                delete user.hash;
            }
            if (user && !user.token)
                return null;
            return user || null;
        }
        catch (error) {
            return { error: error };
        }
    }
    async ValidateToken(id, bool, twoFa) {
        if (twoFa !== undefined) {
            await this.prism.user.update({
                where: {
                    id,
                },
                data: {
                    token: bool,
                    twofaCheck: twoFa,
                },
            });
        }
        else {
            await this.prism.user.update({
                where: {
                    id,
                },
                data: {
                    token: bool,
                },
            });
        }
    }
    async ValideteUser(email, userName, image, first_name = 'null', last_name = 'null') {
        try {
            const user = await this.prism.user.findUnique({
                where: {
                    email,
                },
                select: {
                    id: true,
                    email: true,
                    userName: true,
                    update: true,
                },
            });
            if (user) {
                this.ValidateToken(user.id, true, false);
                return user;
            }
            else {
                try {
                    const username = await this.generateUniqueUsername(userName);
                    const hash = await argon.hash("req.password");
                    const data = await this.prism.user.create({
                        data: {
                            email: email,
                            hash: hash,
                            userName: username,
                            firstName: first_name,
                            lastName: last_name,
                            image: image,
                            token: true,
                        },
                        select: {
                            id: true,
                            email: true,
                            userName: true,
                            update: true,
                        },
                    });
                    return data;
                }
                catch (error) {
                    return { error: error };
                }
            }
        }
        catch (error) {
            return { error: error };
        }
    }
    async signin(req) {
        try {
            const user = await this.prism.user.findFirst({
                where: {
                    OR: [{ email: req.email }, { userName: req.userName }],
                },
                select: {
                    id: true,
                    email: true,
                    userName: true,
                    hash: true,
                    update: true,
                },
            });
            if (user && (await argon.verify(user.hash, req.password))) {
                console.log(req.email, "     ", req.userName);
                delete user.hash;
                await this.ValidateToken(user.id, true, false);
                return { user: user };
            }
            else
                return { error: "password icorrect !!" };
        }
        catch (error) {
            return { error: error };
        }
    }
};
exports.authService = authService;
exports.authService = authService = __decorate([
    (0, common_1.Injectable)({}),
    __metadata("design:paramtypes", [prisma_service_1.prismaService,
        _2fa_1.TwoFactorAuthenticationService])
], authService);
//# sourceMappingURL=auth.service.js.map