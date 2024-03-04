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
let authService = class authService {
    constructor(prism) {
        this.prism = prism;
    }
    ;
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
                throw new Error('An error occurred while checking for username uniqueness.');
            }
        }
        return uniqueUsername;
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
                }
            });
            return { 'user': user };
        }
        catch (error) {
            return { 'error': error };
        }
    }
    async signup(req) {
        console.log(req);
        try {
            const hash = await argon.hash('req.password');
            const username = await this.generateUniqueUsername(req.firstName);
            console.log(username);
            const data = await this.prism.user.create({
                data: {
                    email: req.email,
                    lastName: req.lastName,
                    firstName: req.firstName,
                    hash: hash,
                    userName: username,
                }
            });
            if (data)
                delete data.hash;
            return { data };
        }
        catch (error) {
            if (error.meta?.target[0])
                return { 'error': { message: `this ${error.meta?.target[0]} already exist`, target: error.meta?.target[0] } };
            else
                return { 'error': error };
        }
    }
    async findUser(id) {
        try {
            const user = await this.prism.user.findUnique({
                where: {
                    id
                }
            });
            if (user) {
                this.ValidateToken(id, true);
                delete user.hash;
            }
            if (user && !user.token)
                return null;
            return user || null;
        }
        catch (error) {
            return { 'error': error };
        }
    }
    async ValidateToken(id, bool) {
        await this.prism.user.update({
            where: {
                id,
            },
            data: {
                token: bool,
                online: bool,
            }
        });
    }
    async ValideteUser(email, userName, image) {
        try {
            const user = await this.prism.user.findUnique({
                where: {
                    email
                },
                select: {
                    id: true,
                    email: true,
                    userName: true,
                    update: true,
                }
            });
            if (user) {
                this.ValidateToken(user.id, true);
                return user;
            }
            else {
                try {
                    const username = await this.generateUniqueUsername(userName);
                    const hash = await argon.hash('req.password');
                    const data = await this.prism.user.create({
                        data: {
                            email: email,
                            hash: hash,
                            userName: username,
                            firstName: 'hhhhh',
                            image: image,
                            token: true,
                        },
                        select: {
                            id: true,
                            email: true,
                            userName: true,
                            update: true,
                        }
                    });
                    return data;
                }
                catch (error) {
                    return { 'error': error };
                }
            }
        }
        catch (error) {
            return { 'error': error };
        }
    }
    async signin(req) {
        try {
            const user = await this.prism.user.findFirst({
                where: {
                    OR: [
                        { email: req.email },
                        { userName: req.userName },
                    ],
                },
                select: {
                    id: true,
                    email: true,
                    userName: true,
                    hash: true,
                    update: true,
                }
            });
            if (user && await argon.verify(user.hash, req.password)) {
                console.log(req.email, "     ", req.userName);
                delete user.hash;
                return { 'user': user };
            }
            else
                return { 'error': 'password icorrect !!' };
        }
        catch (error) {
            return { 'error': error };
        }
    }
};
exports.authService = authService;
exports.authService = authService = __decorate([
    (0, common_1.Injectable)({}),
    __metadata("design:paramtypes", [prisma_service_1.prismaService])
], authService);
//# sourceMappingURL=auth.service.js.map