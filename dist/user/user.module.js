"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const jwtguards_1 = require("../authentication/jwtStrategy/jwtguards");
const prisma_service_1 = require("../prisma/prisma.service");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const cloudinary_service_1 = require("../authentication/cloudinary.service");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        controllers: [user_controller_1.UserController],
        providers: [prisma_service_1.prismaService, jwtguards_1.JwtAuthGuard, user_service_1.FriendsService, cloudinary_service_1.cloudinaryService]
    })
], UserModule);
//# sourceMappingURL=user.module.js.map