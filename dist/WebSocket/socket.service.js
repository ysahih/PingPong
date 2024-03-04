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
exports.socketService = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const payload_message_1 = require("../authentication/dto/payload.message");
const jwt = require("jsonwebtoken");
const prisma_service_1 = require("../prisma/prisma.service");
let socketService = class socketService {
    constructor(prisma) {
        this.prisma = prisma;
        this.clients = new Map();
    }
    async handleConnection(client) {
        const token = client.handshake.auth.token;
        if (!token) {
            client.disconnect();
            return;
        }
        try {
            const payload = jwt.verify(token, 'essadike');
            console.log();
            this.clients.set(payload['userName'], client);
            console.log(`Client connected: ${client.id} : ${payload['id']}`);
        }
        catch (e) {
            console.log(e);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        this.clients.delete(client.id);
        console.log(`Client disconnected: ${client.id}`);
    }
    handleMessage(client, payload) {
        console.log(client.id, " : ", payload.id);
        const recipientClientId = payload.id;
        console.log(recipientClientId);
        const recipientClient = this.clients.get(recipientClientId);
        if (recipientClient) {
            recipientClient.emit('message', { message: payload.message });
        }
        else {
            console.log('Client not found!');
        }
        return 'Hello world!';
    }
    typing(client, payload) {
        console.log(client.id, " : ", payload.id);
        const recipientClientId = payload.id;
        console.log(recipientClientId);
        const recipientClient = this.clients.get(recipientClientId);
        if (recipientClient) {
            recipientClient.emit('typing', { message: payload.message });
        }
        else {
            console.log('Client not found!');
        }
        return 'Hello world!';
    }
};
exports.socketService = socketService;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], socketService.prototype, "server", void 0);
__decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        whitelist: true,
    })),
    (0, websockets_1.SubscribeMessage)('message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, payload_message_1.Payload]),
    __metadata("design:returntype", String)
], socketService.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, payload_message_1.Payload]),
    __metadata("design:returntype", String)
], socketService.prototype, "typing", null);
exports.socketService = socketService = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({ cors: true, }),
    __metadata("design:paramtypes", [prisma_service_1.prismaService])
], socketService);
//# sourceMappingURL=socket.service.js.map