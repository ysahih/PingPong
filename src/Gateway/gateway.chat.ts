import { Body, Logger,UseFilters,  UsePipes, ValidationPipe } from "@nestjs/common";
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { UsersServices } from "./usersRooms/user.class";
import { CreateRoom, JoinRoomDTO, MessageDTO } from "./gateway.interface";
import { RoomsServices } from "./usersRooms/room.class";
import { Prisma } from "@prisma/client";
import { ExceptionHandler } from "./ExceptionFilter/exception.filter";
import { GatewayService } from "./geteway.service";
import * as jwt from 'jsonwebtoken';
import { FriendsService } from "src/user/user.service";


@WebSocketGateway({
	cors: {
		origin: [process.env.FRONTEND_URL],
		credentials: true,
	},
})
export class serverGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	private _server: Server = new Server();

	logger: Logger = new Logger(serverGateway.name);

	constructor(private _users: UsersServices, private _rooms: RoomsServices, private _prisma: GatewayService, private FriendsService: FriendsService) { }

	async afterInit() {

		this.logger.log('The Default gateway succefully started.');
	}

	// Authorization Part
	async handleConnection(client: Socket): Promise<void> {

		try {
			const allToken = client.handshake.headers.cookie;

			if (!allToken)
				throw (new Error());

			const accessToken = allToken.split('; ').find(element => element.startsWith('jwt='));

			const payload = jwt.verify(accessToken.split('=')[1], 'essadike');

			const user = await this._prisma.findUser(payload['id']);

			this._users.addUser(client, this._users.organizeUserData(client.id, user), this._rooms.connectToRooms);

		} catch(err) {
			this._server.to(client.id).emit('error', 'Unauthorized !');
			client.disconnect();
		}
	}

	handleDisconnect(@ConnectedSocket() client: Socket): void {

		// Get the user out of the rooms and out of the users Map
		this._users.deleteUser(client, this._rooms.disconnectToRooms);
	}

	@UseFilters(ExceptionHandler)
	@UsePipes(ValidationPipe)
	@SubscribeMessage('directMessage')
	async handleDirectMessage(@ConnectedSocket() client: Socket, @Body() payload: MessageDTO): Promise<void> {

		// TODO: Check Blocked At Users and rooms, Also Muted

		// Get sender User Infos
		const fromUser = this._users.getUserById(payload.from);
		// Check if already there's that conversation
		const isExist = fromUser.DirectChat.find(conv => conv.toUserId === payload.to);

		if (!isExist) {
			console.log('Conversation does not Exist !');
			// If dosn't exist create new record
			const newConv = await this._prisma.createConversation(payload);
			// ADD conversation ID for USER1 and USER2
			this._users.addNewConversation(payload, newConv.id);
		}
		else {
			console.log('Conversation Exists !');
			// If Exist Just add the message at the conversation ID
			await this._prisma.updateConversation(isExist.id, payload);
		}
		// Check if the receiver user is online between the _users
		const toUser = this._users.getUserById(payload.to);
		// if is Online, send him a message to the 'chat' event
		if (toUser)
			toUser.socketId.forEach((socktId :string) => this._server.to(socktId).emit('chat', payload.message));
	}

	@UseFilters(ExceptionHandler)
	@UsePipes(ValidationPipe)
	@SubscribeMessage('createRoom')
	async handleCreateRoom(@ConnectedSocket() client: Socket, @Body() payload: CreateRoom): Promise<void> {

		try {

			// TODO: Handle if it is protected it should contain a password
			// Create a room record
			const newRoom = await this._prisma.createRoom(payload, payload.type);
			// Add the room to the user's room array of Objects
			this._users.addNewRoom(payload.ownerId, newRoom, 'OWNER');
			console.log(this._users.getUserById(payload.ownerId));

			// Check Execption
		} catch (e) {
			// If it's From prisma
			// FIXME: I don't have to send errors to all client
			if ((e) instanceof Prisma.PrismaClientKnownRequestError) {
				// Means that the room already exist with that name
				if (e.code === 'P2002')
					this._server.to(client.id).emit('error', `${payload.name} already exists !`);
			}
			// Something else happened
			else
				this._server.to(client.id).emit('error', `${payload.name} Room creation failed !`);
		}
	}

	// TODO: Check Banned
	@UseFilters(ExceptionHandler)
	@UsePipes(ValidationPipe)
	@SubscribeMessage('joinRoom')
	async handleJoinRoom(@ConnectedSocket() client: Socket, @Body() payload: JoinRoomDTO): Promise<void> {

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
			}
			else {
				// If doesn't exist just inform the user
				this._server.to(client.id).emit('error', `Room with ${payload.roomId}:ID not found !`);
			}
		}
		catch (e) {
			// This exeception throws when the user is already there
			if (e.code === 'P2002')
				this._server.to(client.id).emit('error', `User with ${payload.userId}:ID already exists !`);
			// Something else happened
			else
				this._server.to(client.id).emit('error', `User with ${payload.userId}:ID can't join the room !`);
		}
	}
	/**
	 * handle friends request : by essadike
	 */

	@SubscribeMessage('NewInvit')
	async handleNewFriend(@ConnectedSocket() client: Socket, @Body() Payload: any) {
		
		// If you want all sockets (Windows) of the same client
		// You can get the client infos by "ID", like
		// const user = this._users.getUserById(Payload.fromId);
		// and then iterate on the user.sockets array using "forEach", like
		// user.sockets.forEach((socketId :string) => this._server.emit(YOUR_EVENT_NAME, THE_MESSAGE));
		// In that "forEach" Method you can emit events to all sockets (Windows) of the same client/user

		const targetFriend = await this.FriendsService.sendFriendRequest(Payload.from, Payload.to);

	}
	/**
	 * end of functions :by essadike
	 */

};
