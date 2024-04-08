/// <reference types="cookie-parser" />
/// <reference types="multer" />
import { FriendsService } from "./user.service";
import { Request } from "express";
import { Prisma } from "@prisma/client";
import { cloudinaryService } from "src/authentication/cloudinary.service";
export declare class UserController {
    private FriendsService;
    private cloud;
    constructor(FriendsService: FriendsService, cloud: cloudinaryService);
    RequestFriend(id: string, req: Request): Promise<{
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
    getFriendRequest(req: Request): Promise<{
        id: number;
        sender: {
            userName: string;
            id: number;
            image: string;
        };
    }[]>;
    sendFriendRequest(req: Request): Promise<{
        id: number;
        userName: string;
        image: string;
        online: boolean;
    }[]>;
    acceptFriendRequest(id: string, req: Request): Promise<any>;
    getBlocked(req: Request): Promise<{
        id: number;
        userName: string;
        image: string;
    }[]>;
    blockFriend(id: string, req: Request): Promise<{
        userName: string;
        id: number;
        image: string;
    }>;
    unblockFriend(id: string, req: Request): Promise<Prisma.BatchPayload>;
    searchUser(userName: string, req: Request): Promise<{
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
    searchUserById(id: string, req: Request): Promise<{
        userName: string;
        id: number;
        image: string;
        online: boolean;
    }>;
    GetConversation(req: Request): Promise<import("../Gateway/gateway.interface").ChatData[]>;
    GetMessages(req: Request): Promise<import("../Gateway/gateway.interface").ConvData>;
    getSentInvits(req: Request): Promise<{
        id: number;
        receiver: {
            userName: string;
            id: number;
            image: string;
        };
    }[]>;
    getNotifications(req: Request): Promise<{
        notifications: {
            userName: string;
            id: number;
            createdAt: Date;
            image: string;
            content: string;
            seen: boolean;
        }[];
    }>;
    NotificationsSeen(req: Request): Promise<Prisma.BatchPayload>;
    CreateRoom(file: Express.Multer.File, req: Request): Promise<{
        status: number;
        message: string;
    }>;
}
