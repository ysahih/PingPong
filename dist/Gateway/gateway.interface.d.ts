import { ROLE, ROOMTYPE } from "@prisma/client";
export declare class MessageDTO {
    from: number;
    to: number;
    message: string;
}
export declare class JoinRoomDTO {
    roomId: number;
    userId: number;
}
export declare class CreateRoom {
    ownerId: number;
    name: string;
    type: ROOMTYPE;
    password?: string;
    image?: string;
}
export declare class UpdateStatusRoom {
    userName: string;
    userId: number;
    roomId: number;
    role?: ROLE;
    isMuted?: boolean;
}
export declare class ChatData {
    id: number;
    userName: string;
    image: string;
    lastMessage: string;
    createdAt: Date;
    isOnline: boolean;
    isRead: boolean;
    isRoom: boolean;
}
export declare class Messages {
    content: string;
    userId: number;
}
export declare class ConvData {
    id: number;
    userName: string;
    image: string;
    messages: Messages[];
}
export declare class RoomUsers {
    userId: number;
    roomId: number;
    userName: string;
    image: string;
    isMuted: boolean;
    role: ROLE;
}
