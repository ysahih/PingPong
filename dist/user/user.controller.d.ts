import { UserService } from './user.service';
import { Request } from 'express';
export declare class UserController {
    private Userservice;
    constructor(Userservice: UserService);
    RequestFriend(req: Request): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        senderId: number;
        receiverId: number;
        accepted: boolean;
        blocked: boolean;
    }>;
    getFriendRequest(req: Request): Promise<{
        userName: string;
        id: number;
        image: string;
        friendRequests: {
            senderId: number;
            accepted: boolean;
        }[];
    }[]>;
    acceptFriendRequest(req: Request): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
