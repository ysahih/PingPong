import { User } from "./UserRoom.interface";
import { Socket } from "socket.io";
import { Room } from "./UserRoom.interface";
import { MessageDTO } from "../gateway.interface";
import { ROLE } from "@prisma/client";
export declare class UsersServices {
    private _users;
    constructor();
    addUser(socket: Socket, user: User, cb: (socket: Socket, rooms: Room[]) => void): void;
    getUserById(id: number): User;
    findUserSocket(socketId: string): Promise<{
        id: number;
        index: number;
    } | null>;
    deleteUser(socket: Socket, cb: (socket: Socket, rooms: Room[]) => void): Promise<number>;
    organizeUserData(socketId: string, foundUser: any): User;
    addNewConversation(payload: MessageDTO, newConvId: number): void;
    addNewRoom(userId: number, room: any, userRole?: ROLE): void;
    getAllSocketsIds(): string[];
}
