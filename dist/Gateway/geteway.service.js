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
exports.GatewayService = void 0;
const common_1 = require("@nestjs/common");
const gateway_interface_1 = require("./gateway.interface");
const prisma_service_1 = require("../prisma/prisma.service");
let GatewayService = class GatewayService {
    constructor(_prisma) {
        this._prisma = _prisma;
    }
    async findUser(id) {
        const user = await this._prisma.user.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                userName: true,
                rooms: {
                    select: {
                        userRole: true,
                        room: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                            },
                        },
                    },
                },
                conv: {
                    select: {
                        id: true,
                        users: true,
                    },
                },
            },
        });
        return user;
    }
    async createConversation(payload) {
        const newConv = await this._prisma.converstaion.create({
            data: {
                users: {
                    connect: [{ id: payload.from }, { id: payload.to }],
                },
                messages: {
                    create: {
                        content: payload.message,
                        userId: payload.from,
                        readBy: {
                            create: { users: { connect: { id: payload.from } } },
                        },
                    },
                },
            },
        });
        return newConv;
    }
    async updateConversation(id, payload) {
        await this._prisma.converstaion.update({
            where: {
                id: id,
            },
            data: {
                messages: {
                    create: {
                        content: payload.message,
                        userId: payload.from,
                    },
                },
            },
        });
    }
    async createRoom(payload, roomType) {
        const newRoom = await this._prisma.room.create({
            data: {
                name: payload.name,
                type: roomType,
                image: payload.image ? payload.image : null,
                users: {
                    create: {
                        userRole: "OWNER",
                        userId: payload.ownerId,
                    },
                },
            },
        });
        return newRoom;
    }
    async findRoom(id) {
        const foundedRoom = await this._prisma.room.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                name: true,
                type: true,
            },
        });
        return foundedRoom;
    }
    async joinRoom(id, payload) {
        await this._prisma.room.update({
            where: {
                id: id,
            },
            data: {
                users: {
                    create: {
                        userId: payload.userId,
                    },
                },
            },
        });
    }
    async findMessage(id) {
        const message = await this._prisma.message.findMany({
            where: {
                id: {
                    in: [1, 2],
                },
            },
            include: {
                readBy: {
                    include: {
                        users: true,
                    },
                },
                conv: true,
                user: true,
                room: true,
            },
        });
        return message;
    }
    async allConversations(id) {
        const lastMessajes = await this._prisma.user.findUnique({
            where: {
                id: id,
            },
            select: {
                conv: {
                    orderBy: {
                        messages: {
                            _count: "asc",
                        },
                    },
                    include: {
                        users: {
                            where: {
                                id: {
                                    not: id,
                                },
                            },
                            select: {
                                id: true,
                                userName: true,
                                image: true,
                            },
                        },
                        messages: {
                            orderBy: {
                                createdAt: "desc",
                            },
                            take: 1,
                            select: {
                                content: true,
                                createdAt: true,
                                userId: true,
                                readBy: {
                                    select: {
                                        users: {
                                            select: {
                                                id: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        let sortedData = new Array();
        if (lastMessajes?.conv) {
            lastMessajes.conv.forEach((conv) => {
                let orgConv = new gateway_interface_1.ChatData();
                if (conv?.users[0]) {
                    orgConv.id = conv.users[0].id;
                    orgConv.userName = conv.users[0].userName;
                    orgConv.image = conv.users[0].image;
                }
                if (conv?.messages) {
                    orgConv.lastMessage = conv.messages[0].content;
                    orgConv.createdAt = conv.messages[0].createdAt;
                    if (conv?.messages[0].readBy)
                        orgConv.isRead = true;
                    else
                        orgConv.isRead = false;
                    orgConv.isRoom = false;
                    orgConv.isOnline = orgConv.isRead;
                }
                if (orgConv)
                    sortedData.push(orgConv);
            });
        }
        console.log(sortedData);
        return sortedData;
    }
    async message(userId, withUserId, isRoom = false) {
        if (!isRoom) {
            const user = await this._prisma.converstaion.findFirst({
                where: {
                    AND: [
                        { users: { some: { id: userId } } },
                        { users: { some: { id: withUserId } } },
                    ],
                },
                select: {
                    users: {
                        where: {
                            NOT: {
                                id: userId,
                            },
                        },
                        select: {
                            id: true,
                            userName: true,
                            image: true,
                        },
                    },
                    messages: {
                        orderBy: {
                            createdAt: "desc",
                        },
                        select: {
                            content: true,
                            userId: true,
                        },
                    },
                },
            });
            console.log(user);
        }
    }
    async uniqueConvo(senderId, receiverId) {
        const user = await this._prisma.converstaion.findFirst({
            where: {
                AND: [
                    { users: { some: { id: senderId } } },
                    { users: { some: { id: receiverId } } },
                ],
            },
            include: {
                users: {
                    where: {
                        NOT: {
                            id: receiverId,
                        },
                    },
                    select: {
                        id: true,
                        userName: true,
                        image: true,
                    },
                },
                messages: {
                    take: 1,
                    orderBy: {
                        createdAt: 'desc',
                    },
                    select: {
                        content: true,
                        createdAt: true,
                        userId: true,
                    },
                },
            },
        });
        const convo = {
            id: user.users[0].id,
            userName: user.users[0].userName,
            image: user.users[0].image,
            lastMessage: user.messages[0].content,
            createdAt: user.messages[0].createdAt,
            isOnline: false,
            isRead: false,
            isRoom: false,
        };
        console.log(convo);
        return (convo);
    }
    async userInfogame(id) {
        const user = await this._prisma.user.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                userName: true,
                image: true,
            }
        });
        return (user);
    }
};
exports.GatewayService = GatewayService;
exports.GatewayService = GatewayService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.prismaService])
], GatewayService);
//# sourceMappingURL=geteway.service.js.map