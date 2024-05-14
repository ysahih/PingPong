import { ROOMTYPE } from "@prisma/client";
import { CreateRoom, MessageDTO, JoinRoomDTO, ChatData } from "src/Gateway/gateway.interface";
import { prismaService } from "src/prisma/prisma.service";
export declare class GatewayService {
    private _prisma;
    constructor(_prisma: prismaService);
    findUser(id: number): Promise<{
        userName: string;
        id: number;
        rooms: {
            room: {
                id: number;
                name: string;
                type: import(".prisma/client").$Enums.ROOMTYPE;
            };
            userRole: import(".prisma/client").$Enums.ROLE;
        }[];
        conv: {
            id: number;
            users: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                userName: string;
                email: string;
                hash: string;
                image: string;
                firstName: string;
                secret: string;
                twoFa: boolean;
                twofaCheck: boolean;
                lastName: string;
                token: boolean;
                online: boolean;
                update: boolean;
            }[];
        }[];
    }>;
    createConversation(payload: MessageDTO): Promise<{
        id: number;
    }>;
    updateConversation(id: number, payload: MessageDTO): Promise<void>;
    createRoom(payload: CreateRoom, roomType: ROOMTYPE): Promise<{
        id: number;
        name: string;
        type: import(".prisma/client").$Enums.ROOMTYPE;
        password: string;
        image: string;
    }>;
    findRoom(id: number): Promise<{
        id: number;
        name: string;
        type: import(".prisma/client").$Enums.ROOMTYPE;
    }>;
    joinRoom(id: number, payload: JoinRoomDTO): Promise<void>;
    findMessage(id: number): Promise<({
        user: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userName: string;
            email: string;
            hash: string;
            image: string;
            firstName: string;
            secret: string;
            twoFa: boolean;
            twofaCheck: boolean;
            lastName: string;
            token: boolean;
            online: boolean;
            update: boolean;
        };
        room: {
            id: number;
            name: string;
            type: import(".prisma/client").$Enums.ROOMTYPE;
            password: string;
            image: string;
        };
        readBy: {
            users: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                userName: string;
                email: string;
                hash: string;
                image: string;
                firstName: string;
                secret: string;
                twoFa: boolean;
                twofaCheck: boolean;
                lastName: string;
                token: boolean;
                online: boolean;
                update: boolean;
            }[];
        } & {
            id: number;
            messsageId: number;
        };
        conv: {
            id: number;
        };
    } & {
        id: number;
        content: string;
        createdAt: Date;
        roomId: number;
        convId: number;
        userId: number;
    })[]>;
    allConversations(id: number): Promise<ChatData[]>;
    message(userId: number, withUserId: number, isRoom?: boolean): Promise<void>;
    uniqueConvo(senderId: number, receiverId: number): Promise<ChatData>;
    userInfogame(id: number): Promise<{
        userName: string;
        id: number;
        image: string;
    }>;
}
