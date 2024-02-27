import { Injectable } from "@nestjs/common";
import { Room, User, UserInRoom } from "./UserRoom.interface";


@Injectable()
export class RoomsServices {

	private _rooms :Map<string, UserInRoom[]>;

	constructor() {

		this._rooms = new Map<string, UserInRoom[]>;
	}

	// TODO: First User is the Owner
	create(roomName :string, user :User) :void{

		if (this._rooms.has(roomName))
			throw (new Error('Room Already Exists !'));

		this._rooms.set(roomName, [{
			user: user,
			role: 'OWNER',
		}]);
		console.log(this._rooms.get(roomName));
	}

	getRoomByName(roomName :string) :UserInRoom[] {
		return (this._rooms.get(roomName));
	}

	// TODO: Protected / Private / Public rooms
	join(roomName :string, user :User) :void {

		if (!this._rooms.has(roomName))
			throw (new Error(`'${roomName}' room doesn't Exist !`));

		// for (let value of this._rooms.values())
		// 	if (value.)
		console.log(this._rooms.get(roomName).values());

		this._rooms.get(roomName).push({
			user: user,
			role: 'USER'
		});
	}

	printUsersInRoom(roomName :string) :void {
		console.log(`\n---------- ${roomName} ------------`);
		console.log(this._rooms.get(roomName));
		console.log(`------------------------------------\n`);
	}
};