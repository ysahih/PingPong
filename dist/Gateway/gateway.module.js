"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayModule = void 0;
const common_1 = require("@nestjs/common");
const gateway_chat_1 = require("./gateway.chat");
const user_class_1 = require("./usersRooms/user.class");
const room_class_1 = require("./usersRooms/room.class");
const geteway_service_1 = require("./geteway.service");
const user_service_1 = require("../user/user.service");
let GatewayModule = class GatewayModule {
};
exports.GatewayModule = GatewayModule;
exports.GatewayModule = GatewayModule = __decorate([
    (0, common_1.Module)({
        providers: [gateway_chat_1.serverGateway, user_class_1.UsersServices, room_class_1.RoomsServices, geteway_service_1.GatewayService, user_service_1.FriendsService],
    })
], GatewayModule);
;
//# sourceMappingURL=gateway.module.js.map