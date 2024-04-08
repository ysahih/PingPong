import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { Room } from "./UserRoom.interface";

@Injectable()
export class RoomsServices {

	constructor() { }

	connectToRooms(socket: Socket, rooms: Room[]): void {

		if (rooms.length)
			rooms.forEach(room => socket.join(room.name));
	}

	disconnectToRooms(socket: Socket, rooms: Room[]): void {

		if (rooms.length)
			rooms.forEach(room => socket.leave(room.name));
	}
};