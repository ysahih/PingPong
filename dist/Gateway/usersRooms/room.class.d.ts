import { Socket } from "socket.io";
import { Room } from "./UserRoom.interface";
export declare class RoomsServices {
    constructor();
    connectToRooms(socket: Socket, rooms: Room[]): void;
    disconnectToRooms(socket: Socket, rooms: Room[]): void;
}
