import { Injectable } from "@nestjs/common";
import { Conversations, User } from "./UserRoom.interface";
import { Socket } from "socket.io";
import { Room } from "./UserRoom.interface";
import { MessageDTO } from "../gateway.interface";
import { ROLE } from "@prisma/client";

@Injectable()
export class UsersServices {
  // Properties
  private _users: Map<number, User>;

  // Default Constructor
  constructor() {
    this._users = new Map<number, User>();
  }

  // Add the user to the map and connected to the rooms
  addUser(
    socket: Socket,
    user: User,
    cb: (socket: Socket, rooms: Room[]) => void
  ) {
    if (this._users.has(user.id)) {
      this._users.get(user.id).socketId.push(socket.id);
      console.log(`${user.username}:ID already Exists!`);
    } else {
      this._users.set(user.id, user);
      console.log(`${user.username} added !`);
    }
    console.log(this._users.get(user.id));
    // Connect to rooms
    cb(socket, this._users.get(user.id).rooms);
    // TODO: Made status as ONLINE
  }

  // Get Connected User By "DB Id"
  getUserById(id: number): User {
    return this._users.get(id);
  }

  // Find socketId's user and return a Promise with that userId and index od socket at the sockets array
  async findUserSocket(
    socketId: string
  ): Promise<{ id: number; index: number } | null> {
    for (const user of this._users.values()) {
      const index = user.socketId.indexOf(socketId);
      if (index != -1) return { id: user.id, index: index };
    }
    return null;
  }

  // Delete A Connected user
  async deleteUser(
    socket: Socket,
    cb: (socket: Socket, rooms: Room[]) => void
  ): Promise<number> {
    const data: { id: number; index: number } = await this.findUserSocket(
      socket.id
    );

    if (data) {
      cb(socket, this._users.get(data.id).rooms);

      console.log("Before: ");
      console.log(this._users.get(data.id).socketId);

      this._users.get(data.id).socketId.splice(data.index, 1);

      console.log("After: ");
      console.log(this._users.get(data.id).socketId);

      if (!this._users.get(data.id).socketId.length) {
        console.log(`${this._users.get(data.id).username} will be deleted !`);
        this._users.delete(data.id);
      }
      // TODO: Made status as OFFLINE
      return data.id;
    }
  }

  // Orginize Founded User from the DB Into The User Interface Shape
  organizeUserData(socketId: string, foundUser: any): User {
    const newUser: User = {
      id: foundUser.id,
      username: foundUser.userName,
      socketId: [socketId],
      rooms: foundUser.rooms.map((room) => {
        const newRoom: Room = {
          id: room.room.id,
          name: room.room.name,
          UserRole: room.userRole,
          type: room.room.type,
        };
        return newRoom;
      }),
      DirectChat: foundUser.conv.map((conv) => {
        const newConv: Conversations = {
          id: conv.id,
          toUserId:
            conv.users[0].id !== foundUser.id
              ? conv.users[0].id
              : conv.users[1].id,
        };
        return newConv;
      }),
    };

    return newUser;
  }

  // Create new conversation data at the user's map element
  addNewConversation(payload: MessageDTO, newConvId: number): void {
    this._users.get(payload.from).DirectChat.push({
      id: newConvId,
      toUserId: payload.to,
    });

    if (this._users.get(payload.to)) {
      this._users.get(payload.to).DirectChat.push({
        id: newConvId,
        toUserId: payload.from,
      });
    }
  }

  // Add room data at the user's map element
  addNewRoom(userId: number, room: any, userRole?: ROLE): void {
    this._users.get(userId).rooms.push({
      id: room.id,
      name: room.name,
      type: room.type,
      UserRole: userRole || "USER",
    });

    console.log("Room Updates:");
    console.log(this._users.get(userId));
  }

  getAllSocketsIds(): string[] {
    let arr: string[] = [];

    for (const user of this._users.values()) {
      arr = arr.concat(user.socketId);
      console.log(arr);
    }

    return arr;
  }
}
