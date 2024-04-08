import { ROLE, ROOMTYPE } from "@prisma/client";
import { ChatData, ConvData, RoomUsers } from "src/Gateway/gateway.interface";
import { prismaService } from "src/prisma/prisma.service";
export declare class FriendsService {
    private prisma;
    constructor(prisma: prismaService);
    SearchCantShow(UserId: number): Promise<{
        id: number;
    }[]>;
    searchUser(userName: string, id: number): Promise<{
        users: {
            userName: string;
            id: number;
            image: string;
        }[];
        sentInvits: {
            id: number;
            receiver: {
                userName: string;
                id: number;
                image: string;
            };
        }[];
    }>;
    searchUserById(id: number, UserId: number): Promise<{
        userName: string;
        id: number;
        image: string;
        online: boolean;
    }>;
    sendFriendRequest(UserId: number, TargetId: number): Promise<{
        id: number;
        sender: {
            userName: string;
            id: number;
            image: string;
        };
        receiver: {
            userName: string;
            id: number;
            image: string;
        };
    }>;
    getfriendsRequest(UserId: number): Promise<{
        id: number;
        sender: {
            userName: string;
            id: number;
            image: string;
        };
    }[]>;
    getSentInvits(UserId: number): Promise<{
        id: number;
        receiver: {
            userName: string;
            id: number;
            image: string;
        };
    }[]>;
    Friends(UserId: number): Promise<{
        id: number;
        userName: string;
        image: string;
        online: boolean;
    }[]>;
    checkFriendRequest(UserId: number, TargetId: number): Promise<{
        id: number;
        accepted: boolean;
        blocked: boolean;
    }>;
    getNotifications(UserId: number): Promise<{
        notifications: {
            userName: string;
            id: number;
            createdAt: Date;
            image: string;
            content: string;
            seen: boolean;
        }[];
    }>;
    newNotification(UserId: number, userName: string, image: string, content: string): Promise<{
        userName: string;
        id: number;
        createdAt: Date;
        image: string;
        content: string;
        seen: boolean;
    }>;
    NotificationsSeen(UserId: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
    acceptFriendRequest(UserId: number, TargetId: number): Promise<any>;
    blockedFriens(UserId: number): Promise<{
        id: number;
        userName: string;
        image: string;
    }[]>;
    Online(id: number, status: boolean): Promise<{
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
    }>;
    blockFriendRequest(UserId: number, TargetId: number): Promise<{
        userName: string;
        id: number;
        image: string;
    }>;
    deleteFriendRequest(UserId: number, TargetId: number): Promise<{
        userName: string;
        id: number;
        image: string;
    }>;
    unblockFriendRequest(UserId: number, TargetId: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
    Getconversation(id: number): Promise<ChatData[]>;
    message(userId: number, withUserId: number, isRoom?: boolean): Promise<ConvData>;
    createRoom(userId: number, name: string, type: ROOMTYPE, password: string, fileURL: string): Promise<{
        id: number;
        name: string;
        type: import(".prisma/client").$Enums.ROOMTYPE;
        password: string;
        image: string;
    }>;
    roomUsers(roomName: string): Promise<RoomUsers[]>;
    userState(roomId: number, role: ROLE, isMuted: boolean, userId: number): Promise<void>;
}
