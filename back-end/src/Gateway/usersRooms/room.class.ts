import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { Room } from "./UserRoom.interface";
import { Server } from "socket.io"

@Injectable()
export class RoomsServices {

	constructor() { }

	connectToRooms(socket: Socket, rooms: Room[]): void {
		// console.log("Socket:", socket.id);
		// console.log("Rooms:", rooms);

		if (rooms.length)
			rooms.forEach(room => socket.join(room.id.toString()));
			// rooms.forEach(room => socket.join(room.name));
	}

	disconnectToRooms(socket: Socket, rooms: Room[]): void {

		if (rooms.length)
			rooms.forEach(room => socket.leave(room.id.toString()));
			// rooms.forEach(room => socket.leave(room.name));
	}

	async connectToRoom(server :Server, sockets :string[], room :string) {

		// if (sockets.length)
			// sockets.forEach((socketId) => {
			// 	await server.in(socketId).socketsJoin(room)
			// });
		if (sockets.length)
			sockets.forEach((socketId) => server.sockets.sockets.get(socketId)?.join(room));
		// for (const socketId of sockets) {
		// 	server.in(socketId).socketsJoin(room);
		// }
		// console.log(await server.in(room).fetchSockets());
		// console.log(await server.fetchSockets());
	}
};
