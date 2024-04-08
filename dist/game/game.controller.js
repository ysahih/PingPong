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
exports.gameController = void 0;
const game_service_1 = require("./game.service");
const jwtguards_1 = require("../authentication/jwtStrategy/jwtguards");
const common_1 = require("@nestjs/common");
let gameController = class gameController {
    constructor(gameService) {
        this.gameService = gameService;
    }
    async createGame(request) {
        return await this.gameService.generateGame(request.user['userId'], 'gameName');
    }
    async joinGame(request) {
        const id = parseInt(request.query.gameid, 10);
        return await this.gameService.joinGame(id, request.user['userId']);
    }
};
exports.gameController = gameController;
__decorate([
    (0, common_1.Get)('generategame'),
    (0, common_1.UseGuards)(jwtguards_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], gameController.prototype, "createGame", null);
__decorate([
    (0, common_1.Get)('joingame'),
    (0, common_1.UseGuards)(jwtguards_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], gameController.prototype, "joinGame", null);
exports.gameController = gameController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [game_service_1.gameService])
], gameController);
//# sourceMappingURL=game.controller.js.map