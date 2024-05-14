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
exports.RoomUsers = exports.ConvData = exports.Messages = exports.ChatData = exports.UpdateStatusRoom = exports.CreateRoom = exports.JoinRoomDTO = exports.MessageDTO = void 0;
const class_validator_1 = require("@nestjs/class-validator");
const client_1 = require("@prisma/client");
const class_validator_2 = require("class-validator");
class MessageDTO {
}
exports.MessageDTO = MessageDTO;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], MessageDTO.prototype, "from", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], MessageDTO.prototype, "to", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MessageDTO.prototype, "message", void 0);
class JoinRoomDTO {
}
exports.JoinRoomDTO = JoinRoomDTO;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], JoinRoomDTO.prototype, "roomId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], JoinRoomDTO.prototype, "userId", void 0);
class CreateRoom {
}
exports.CreateRoom = CreateRoom;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateRoom.prototype, "ownerId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoom.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ROOMTYPE),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoom.prototype, "type", void 0);
__decorate([
    (0, class_validator_2.ValidateIf)(o => o.type === client_1.ROOMTYPE.PROTECTED),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoom.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoom.prototype, "image", void 0);
class UpdateStatusRoom {
}
exports.UpdateStatusRoom = UpdateStatusRoom;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStatusRoom.prototype, "userName", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateStatusRoom.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateStatusRoom.prototype, "roomId", void 0);
__decorate([
    (0, class_validator_2.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(client_1.ROLE),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStatusRoom.prototype, "role", void 0);
__decorate([
    (0, class_validator_2.IsOptional)(),
    (0, class_validator_2.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateStatusRoom.prototype, "isMuted", void 0);
class ChatData {
}
exports.ChatData = ChatData;
class Messages {
}
exports.Messages = Messages;
class ConvData {
}
exports.ConvData = ConvData;
class RoomUsers {
}
exports.RoomUsers = RoomUsers;
//# sourceMappingURL=gateway.interface.js.map