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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const jwtguards_1 = require("../authentication/jwtStrategy/jwtguards");
let UserController = class UserController {
    constructor(Userservice) {
        this.Userservice = Userservice;
    }
    RequestFriend(req) {
        const json = req.body;
        return this.Userservice.sendFriendRequest(req.user['userId'], parseInt(json['id']));
    }
    getFriendRequest(req) {
        return this.Userservice.FriendRequest(req.user['userId']);
    }
    acceptFriendRequest(req) {
        return this.Userservice.acceptFriendRequest(req.user['userId'], parseInt(req.params.id));
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('sendrequest'),
    (0, common_1.UseGuards)(jwtguards_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "RequestFriend", null);
__decorate([
    (0, common_1.Post)('get'),
    (0, common_1.UseGuards)(jwtguards_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getFriendRequest", null);
__decorate([
    (0, common_1.Post)('/accept/:id'),
    (0, common_1.UseGuards)(jwtguards_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "acceptFriendRequest", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map