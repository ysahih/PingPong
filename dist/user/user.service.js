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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sendFriendRequest(UserId, TargetId) {
        const friends = await this.prisma.friendRequest.create({
            data: {
                senderId: UserId,
                receiverId: TargetId
            }
        });
        return friends;
    }
    async acceptFriendRequest(UserId, TargetId) {
        const friends = await this.prisma.friendRequest.updateMany({
            where: {
                receiverId: UserId
            },
            data: {
                accepted: true
            }
        });
        return friends;
    }
    async FriendRequest(UserId) {
        const reqFriend = await this.prisma.user.findUnique({
            where: {
                id: UserId,
            },
            select: {
                friendRequests: true
            },
        });
        const ids = reqFriend.friendRequests.map(request => request.senderId);
        const users = await this.prisma.user.findMany({
            where: {
                id: { in: ids }
            },
            select: {
                userName: true,
                image: true,
                id: true,
                friendRequests: {
                    where: {
                        receiverId: UserId
                    },
                    select: {
                        senderId: true,
                        accepted: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });
        return users;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.prismaService])
], UserService);
//# sourceMappingURL=user.service.js.map