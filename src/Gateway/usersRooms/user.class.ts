import { Injectable } from "@nestjs/common";
import { Conversations, User } from "./UserRoom.interface";
import { Socket } from "socket.io";
import { Room } from "./UserRoom.interface";

@Injectable()
export class UsersServices {

	// Properties
	private _users: Map<string, User>;

	// Default Constructor
	constructor() {

		this._users = new Map();
	}

	addUser(socket: Socket, user: User, cb: (socket: Socket, rooms: Room[]) => void) {

		console.log(user);
		this._users.set(socket.id, user);
		cb(socket, user.rooms);
		console.log(`${user.username} added !`);
	}

	// Get Connected User By "Socket Id"
	getUserBySocketId(socketId: string): User {

		return (this._users.get(socketId));
	}

	// Get Connected User By "DB Id"
	getUserById(id: number): User {

		for (const user of this._users.values())
			if (user.id == id)
				return (user);
	}

	// Get Connected User By "Username"
	getUserByUsername(username: string): User {

		for (const user of this._users.values())
			if (user.username == username)
				return (user);
	}

	getSocketId(id: number): string {

		for (const user of this._users.values())
			if (user.id == id)
				return (user.socketId);
	}

	// Get All Connected Users
	getAllUser(): Iterable<User> {

		return (this._users.values());
	}

	getUserRooms(socketId: string): string[] {

		return (this._users.get(socketId).rooms.map(room => room.name));
	}

	// Delete A Connected user
	deleteUser(socket: Socket, cb: (socket: Socket, rooms: Room[]) => void): void {

		const user = this._users.get(socket.id);
		if (user) {
			console.log(`${user.username} will be deleted !`);
			cb(socket, this._users.get(socket.id).rooms);
			this._users.delete(socket.id);
		}
	}

	organizeUser(socketId: string, foundUser: any): User {

		// Orginize Founded User Into The User Interface Shape
		const newUser: User = {
			id: foundUser.id,
			username: foundUser.userName,
			socketId: socketId,
			rooms: foundUser.rooms.map(room => {
				const newRoom: Room = {
					id: room.room.id,
					name: room.room.name,
					UserRole: room.userRole,
					type: room.room.type,
				}
				return (newRoom);
			}),
			DirectChat: foundUser.conv.map(conv => {
				const newConv: Conversations = {
					id: conv.id,
					toUserId: conv.users[0].id !== foundUser.id ? conv.users[0].id : conv.users[1].id,
				}
				return (newConv);
			}),
		};

		return (newUser);
	}

	addNewConversation(socketId: string, newConvId: number, toUserId: number): void {

		this._users.get(socketId).DirectChat.push({
			id: newConvId,
			toUserId: toUserId,
		});
	}

	addNewRoom(socketId: string, room: any, userRole): void {

		this._users.get(socketId).rooms.push({
			id: room.id,
			name: room.name,
			type: room.type,
			UserRole: userRole
		});
	}

	printAllUser(): void {

		if (this._users.size) {
			console.log('\n----------- Connected Users -----------');
			for (const user of this._users.values())
				console.log(user);
			console.log('---------------------------------------\n');
		}
	}
}
