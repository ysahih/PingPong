import {
  Body,
  Logger,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UsersServices } from "./usersRooms/user.class";
import { CreateRoom, JoinRoomDTO, MessageDTO } from "./gateway.interface";
import { RoomsServices } from "./usersRooms/room.class";
import { Prisma } from "@prisma/client";
import { ExceptionHandler } from "./ExceptionFilter/exception.filter";
import { GatewayService } from "./geteway.service";
import * as jwt from "jsonwebtoken";
import { FriendsService } from "src/user/user.service";

import { Message } from "@prisma/client";

type Invitation = {
  id: number;
  sender: {
    id: number;
    userName: string;
    image: string;
  };
};

@WebSocketGateway({
  cors: {
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  },
})
export class serverGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private _server: Server = new Server();

  logger: Logger = new Logger(serverGateway.name);

  constructor(
    private _users: UsersServices,
    private _rooms: RoomsServices,
    private _prisma: GatewayService,
    private FriendsService: FriendsService
  ) {}

  async afterInit() {
    this.logger.log("The Default gateway succefully started.");
  }

  // Authorization Part
  async handleConnection(client: Socket): Promise<void> {

    // const mesj = await this._prisma.message(15, 7);

    try {
      const allToken = client.handshake.headers.cookie;

      if (!allToken) throw new Error();

      const accessToken = allToken
        .split("; ")
        .find((element) => element.startsWith("jwt="));

      const payload = jwt.verify(accessToken.split("=")[1], "essadike");

      const user = await this._prisma.findUser(payload["id"]);

      const allSockets = this._users.getAllSocketsIds();

      this._users.addUser(
        client,
        this._users.organizeUserData(client.id, user),
        this._rooms.connectToRooms
      );

      allSockets.forEach((sokcetId: string) =>
        this._server.to(sokcetId).emit("online", { id: user.id })
      );
      this.FriendsService.Online(user.id, true);
    } catch (err) {
      this._server.to(client.id).emit("error", "Unauthorized !");
      client.disconnect();
    }
  }

	// you need to handle the disconnect event, remove the user and set it offline just whenn the user is disconnected of all sockets
  async handleDisconnect(@ConnectedSocket() client: Socket): Promise<void> {
    // Get the user out of the rooms and out of the users Map

    const id = await this._users.deleteUser(
      client,
      this._rooms.disconnectToRooms
    );
	if (id < 0) return;
    const allSockets = this._users.getAllSocketsIds();

    allSockets.forEach((sokcetId: string) =>
      this._server.to(sokcetId).emit("offline", { id: id })
    );

	await this.FriendsService.Online(id, false);
  }

  @UseFilters(ExceptionHandler)
  @UsePipes(ValidationPipe)
  @SubscribeMessage("directMessage")
  async handleDirectMessage(
    @ConnectedSocket() client: Socket,
    @Body() payload: MessageDTO
  ): Promise<void> {
    

    // TODO: When A user send a message at that sended user to read status

    // Get sender User Infos
    const fromUser = this._users.getUserById(payload.from);
    // Check if already there's that conversation
    const isExist = fromUser.DirectChat.find(
      (conv) => conv.toUserId === payload.to
    );

    if (!isExist) {
      console.log("Conversation does not Exist !");
      // If dosn't exist create new record
      const newConv = await this._prisma.createConversation(payload);
      // ADD conversation ID for USER1 and USER2
      this._users.addNewConversation(payload, newConv.id);
    } else {
      console.log("Conversation Exists !");
      // If Exist Just add the message at the conversation ID
      await this._prisma.updateConversation(isExist.id, payload);
    }
    // Check if the receiver user is online between the _users
    const toUser = this._users.getUserById(payload.to);
    // if is Online, send him a message to the 'chat' event
    if (toUser)
      toUser.socketId.forEach((socktId: string) =>
        this._server.to(socktId).emit("chat", payload.message)
      );
  }

  @UseFilters(ExceptionHandler)
  @UsePipes(ValidationPipe)
  @SubscribeMessage("createRoom")
  async handleCreateRoom(
    @ConnectedSocket() client: Socket,
    @Body() payload: CreateRoom
  ): Promise<void> {
    try {
      // TODO: Handle if it is protected it should contain a password
      // Create a room record
      console.log(payload);
      const newRoom = await this._prisma.createRoom(payload, payload.type);
      this._server
            .to(client.id)
            .emit("create", `${payload.name} created succefully !`);
      // Add the room to the user's room array of Objects
      this._users.addNewRoom(payload.ownerId, newRoom, "OWNER");
      console.log(this._users.getUserById(payload.ownerId));

      // Check Execption
    } catch (e) {
      // If it's From prisma
      // FIXME: I don't have to send errors to all client
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // Means that the room already exist with that name
        console.log('Errrrooooor !');
        if (e.code === "P2002")
          this._server
            .to(client.id)
            .emit("error", `${payload.name} already exists !`);
      }
      // Something else happened
      else
        this._server
          .to(client.id)
          .emit("error", `${payload.name} Room creation failed !`);
    }
  }

  // TODO: Check Banned
  @UseFilters(ExceptionHandler)
  @UsePipes(ValidationPipe)
  @SubscribeMessage("joinRoom")
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @Body() payload: JoinRoomDTO
  ): Promise<void> {
    // Check if the room Exists
    const foundedRoom = await this._prisma.findRoom(payload.roomId);

    try {
      // If exists just Join it
      if (foundedRoom) {
        await this._prisma.joinRoom(foundedRoom.id, payload);
        // Add that room to the user's room array of Objects
        this._users.addNewRoom(payload.userId, foundedRoom);
        // Join the virtual room at the server
        client.join(foundedRoom.name);
        console.log(this._users.getUserById(payload.userId));
      } else {
        // If doesn't exist just inform the user
        this._server
          .to(client.id)
          .emit("error", `Room with ${payload.roomId}:ID not found !`);
      }
    } catch (e) {
      // This exeception throws when the user is already there
      if (e.code === "P2002")
        this._server
          .to(client.id)
          .emit("error", `User with ${payload.userId}:ID already exists !`);
      // Something else happened
      else
        this._server
          .to(client.id)
          .emit(
            "error",
            `User with ${payload.userId}:ID can't join the room !`
          );
    }
  }
   /**
   * handle friends request : by essadike
   */


  // need to add online status to here
  @SubscribeMessage("NewInvit")
  async handleNewFriend(
	@ConnectedSocket() client: Socket,
	@Body() Payload: { id: number; userId: number }
  ) {
	const targetFriend = await this.FriendsService.sendFriendRequest(
	  Payload.userId,
	  Payload.id
	);
	
	if (targetFriend) {
	  const newInvit: Invitation = {
		id: targetFriend.id,
		sender: {
		  id: targetFriend.sender.id,
		  userName: targetFriend.sender.userName,
		  image: targetFriend.sender.image,
		},
	  };
	  const Sockets = this._users.getUserById(Payload.id);
	  if (Sockets) {
		Sockets.socketId.forEach((socktId: string) => {
		  this._server.to(socktId).emit("NewInvit", newInvit);
		});
		console.log(" newInvet from :", targetFriend.sender);
	  }
	}
  }

  @SubscribeMessage("NewFriend")
  async handleAcceptFriend(@Body() Payload: { id: number; userId: number }) {
	const targetFriend = await this.FriendsService.acceptFriendRequest(
	  Payload.userId,
	  Payload.id
	);
	if (targetFriend !== null) {
	  const SocketsTarget = this._users.getUserById(Payload.id);
	  if (SocketsTarget) {
		SocketsTarget.socketId.forEach((socktId: string) => {
		  this._server.to(socktId).emit("NewFriend", targetFriend.sender);
		});
	  }
	  const client = this._users.getUserById(Payload.userId);
	  if (client) {
		client.socketId.forEach((socktId: string) => {
		  this._server.to(socktId).emit("NewFriend", targetFriend.reciever);
		});
	  }
	}
  }

  // @SubscribeMessage("RejectFriend")

  @SubscribeMessage("NewBlocked")
  async handleNewBlocked(@Body() Payload: { id: number; userId: number }) {
	const targetFriend = await this.FriendsService.blockFriendRequest(
	  Payload.userId,
	  Payload.id
	);
	if (targetFriend !== null) {
	  const SocketsTarget = this._users.getUserById(Payload.id);
	  if (SocketsTarget) {
		SocketsTarget.socketId.forEach((socktId: string) => {
		  this._server.to(socktId).emit("DeleteFriend", Payload.userId);
		});
	  }
	  const client = this._users.getUserById(Payload.userId);
	  if (client) {
		client.socketId.forEach((socktId: string) => {
		  this._server.to(socktId).emit("NewBlocked", targetFriend);
		});
	  }
	}
  }

  @SubscribeMessage("UnBlocked")
  async handleUnBlocked(@Body() Payload: { id: number; userId: number }) {
	const targetFriend = await this.FriendsService.unblockFriendRequest(
	  Payload.userId,
	  Payload.id
	);
	if (targetFriend !== null) {
	  // const SocketsTarget = this._users.getUserById(Payload.id);
	  // if (SocketsTarget) {
	  //   SocketsTarget.socketId.forEach((socktId: string) => {
	  //     this._server.to(socktId).emit("UnBlocked", Payload.userId);
	  //   });
	  // }
	  console.log("unblocked", targetFriend);
	  
	  const client = this._users.getUserById(Payload.userId);
	  if (client) {
		client.socketId.forEach((socktId: string) => {
		  this._server.to(socktId).emit("UnBlocked", Payload.id);
		});
	  }
	}
  }
  /**
   * end of functions :by essadike
   */
}
