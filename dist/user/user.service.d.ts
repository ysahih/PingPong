import { prismaService } from 'src/prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: prismaService);
    sendFriendRequest(UserId: number, TargetId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        senderId: number;
        receiverId: number;
        accepted: boolean;
        blocked: boolean;
    }>;
    acceptFriendRequest(UserId: number, TargetId: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
    FriendRequest(UserId: number): Promise<{
        userName: string;
        id: number;
        image: string;
        friendRequests: {
            senderId: number;
            accepted: boolean;
        }[];
    }[]>;
}
