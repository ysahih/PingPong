import { Injectable } from "@nestjs/common";
import { User } from "./UserRoom.interface";

@Injectable()
export class UsersServices {

	// Properties
	private _users :Map<string, User>;

	// Default Constructor
	constructor() {

		this._users = new Map();
	}

	addUser(userId :string, user :User) :void {

		console.log(`${user._username} added !`);
		this._users.set(userId, user);
	}

	// Get Connected User By "Socket Id"
	getUserBySocketId(userId :string) :User | null {

		return (this._users.get(userId) ? this._users.get(userId) : null);
		// return (this._users.get(userId));
	}

	// Get Connected User By "DB Id"
	getUserById(id :number) :User | null {

		for (let user of this._users.values())
			if (user._id === id)
				return (user);
		return (null);
	}

	// Get Connected User By "Username"
	getUserByUsername(username :string) :User | null {

		for (let user of this._users.values())
			if (user._username === username)
				return (user);
		return (null);
	}

	// Get All Connected Users
	getAllUser() :Iterable<User> {

		return (this._users.values());
	}

	// Delete A Connected
	deleteUser(userId :string) :void {

		console.log(`${this._users.get(userId)._username} deleted !`);
		this._users.delete(userId);
	}

	printAllUser() :void {

		if (this._users.size)
		{
			console.log('\n----------- Connected Users -----------');
			for (let user of this._users.values())
				console.log(user);
			console.log('---------------------------------------\n');
		}
	}
}