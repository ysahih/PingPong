"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const authenticaton_module_1 = require("./authentication/authenticaton.module");
const user_module_1 = require("./user/user.module");
const game_module_1 = require("./game/game.module");
const prisma_module_1 = require("./prisma/prisma.module");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const gateway_module_1 = require("./Gateway/gateway.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [passport_1.PassportModule.register({ session: true }), config_1.ConfigModule.forRoot({ isGlobal: true, }), authenticaton_module_1.AuthMod, user_module_1.UserModule, game_module_1.GameModule, prisma_module_1.PrismaModule, gateway_module_1.GatewayModule],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map