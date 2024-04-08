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
exports.UsersServices = void 0;
const common_1 = require("@nestjs/common");
let UsersServices = class UsersServices {
    constructor() {
        this._users = new Map();
    }
    addUser(socket, user, cb) {
        if (this._users.has(user.id)) {
            this._users.get(user.id).socketId.push(socket.id);
            console.log(`${user.username}:ID already Exists!`);
        }
        else {
            this._users.set(user.id, user);
            console.log(`${user.username} added !`);
        }
        console.log(this._users.get(user.id));
        cb(socket, this._users.get(user.id).rooms);
    }
    getUserById(id) {
        return this._users.get(id);
    }
    async findUserSocket(socketId) {
        for (const user of this._users.values()) {
            const index = user.socketId.indexOf(socketId);
            if (index != -1)
                return { id: user.id, index: index };
        }
        return null;
    }
    async deleteUser(socket, cb) {
        const data = await this.findUserSocket(socket.id);
        if (data) {
            cb(socket, this._users.get(data.id).rooms);
            console.log('Before: ');
            console.log(this._users.get(data.id).socketId);
            this._users.get(data.id).socketId.splice(data.index, 1);
            console.log('After: ');
            console.log(this._users.get(data.id).socketId);
            if (!this._users.get(data.id).socketId.length) {
                console.log(`${this._users.get(data.id).username} will be deleted !`);
                this._users.delete(data.id);
                return (data.id);
            }
        }
        return (-1);
    }
    organizeUserData(socketId, foundUser) {
        const newUser = {
            id: foundUser.id,
            username: foundUser.userName,
            socketId: [socketId],
            rooms: foundUser.rooms.map((room) => {
                const newRoom = {
                    id: room.room.id,
                    name: room.room.name,
                    UserRole: room.userRole,
                    type: room.room.type,
                };
                return newRoom;
            }),
            DirectChat: foundUser.conv.map((conv) => {
                const newConv = {
                    id: conv.id,
                    toUserId: conv.users[0].id !== foundUser.id
                        ? conv.users[0].id
                        : conv.users[1].id,
                };
                return newConv;
            }),
        };
        return newUser;
    }
    addNewConversation(payload, newConvId) {
        this._users.get(payload.from).DirectChat.push({
            id: newConvId,
            toUserId: payload.to,
        });
        if (this._users.get(payload.to)) {
            this._users.get(payload.to).DirectChat.push({
                id: newConvId,
                toUserId: payload.from,
            });
        }
    }
    addNewRoom(userId, room, userRole) {
        this._users.get(userId).rooms.push({
            id: room.id,
            name: room.name,
            type: room.type,
            UserRole: userRole || "USER",
        });
        console.log("Room Updates:");
        console.log(this._users.get(userId));
    }
    getAllSocketsIds() {
        let arr = [];
        for (const user of this._users.values()) {
            arr = arr.concat(user.socketId);
            console.log(arr);
        }
        return arr;
    }
};
exports.UsersServices = UsersServices;
exports.UsersServices = UsersServices = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UsersServices);
//# sourceMappingURL=user.class.js.map