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





@WebSocketGateway({
	cors: {
		origin: ['http://localhost:5500'],
		credentials: true,
	},
	
})
// @UseGuards()

export class serverGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	private _server: Server = new Server({
	});
	logger: Logger = new Logger(serverGateway.name);

	constructor(private _users: UsersServices, private _rooms: RoomsServices, private _prisma: GatewayService) { }

	async afterInit() {

		// this._server.use(this._middleware.use);
		this.logger.log('The Default gateway succefully started.');
	}

	// Authorization Part
	async handleConnection(client: Socket): Promise<void> {

		// TODO: Get the Key and decode it
	
		console.log(client.handshake.headers.cookie);
		try{
			const token = client.handshake.headers.cookie;
			if (!token)
			{
				client.disconnect(true);
				// return;
			}
			const payload = jwt.verify(token.toString(), 'essadike');
			// TODO: get data from the DB
			console.log('client connect:' ,payload)
		}
		catch(err){
			this._server.to(client.id).emit('error', 'Unauthorized !');
			client.disconnect();
		}
		// console.log(token);

		// Check if the user exists
		// const user = await this._prisma.findUser(parseInt(id.toString()));

		// if exists Just add it the _users map with infos
		// if (user) {
		// 	this._users.addUser(client, this._users.organizeUser(client.id, user), this._rooms.connectToRooms);
		// }
		// else {
		// 	// if doesn't exists send an error
		// 	this._server.to(client.id).emit('error', `Authorization Failed !`);
		// 	// Disconnect him
		// 	client.disconnect(true);
		// }
	}

	handleDisconnect(@ConnectedSocket() client: Socket): void {

		// Get the user out of the rooms and out of the users Map
		this._users.deleteUser(client, this._rooms.disconnectToRooms);
	}

	// TODO: Check Blocked At Users and rooms, Also Muted
	// TODO: Add Message Validator
	@UseFilters(ExceptionHandler)
	@UsePipes(ValidationPipe)
	@SubscribeMessage('directMessage')
	async handleDirectMessage(@ConnectedSocket() client: Socket, @Body() payload: MessageDTO): Promise<void> {

		console.log('Hello');
		// Get sender User Infos
		const fromUser = this._users.getUserBySocketId(client.id);
		// Check if already there's that conversation
		const isExist = fromUser.DirectChat.find(conv => conv.toUserId === payload.to);

		if (!isExist) {
			console.log('Conversation does not Exist !');
			// If dosn't exist create new record
			const newConv = await this._prisma.createConversation(payload);
			// ADD conversation ID for USER1 object
			this._users.addNewConversation(client.id, newConv.id, payload.to);
			// ADD conversation ID for USER2 object
			this._users.addNewConversation(this._users.getSocketId(payload.to), newConv.id, payload.from);
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
			this._server.to(this._users.getSocketId(payload.to)).emit('chat', payload.message);
	}

	@UseFilters(ExceptionHandler)
	@UsePipes(ValidationPipe)
	@SubscribeMessage('createRoom')
	async handleCreateRoom(@ConnectedSocket() client: Socket, @Body() payload: CreateRoom): Promise<void> {

		try {

			// Create a room record
			const newRoom = await this._prisma.createRoom(payload, payload.type);
			// Add the room to the user's room array of Objects
			this._users.addNewRoom(client.id, newRoom, 'OWNER');
			console.log(this._users.getUserBySocketId(client.id));

			// Check Execption
		} catch (e) {
			// If it's From prisma
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

		console.log(payload);

		// Check if the room Exists
		const foundedRoom = await this._prisma.findRoom(payload.roomId);

		try {

			// If exists just Join it
			if (foundedRoom) {
				await this._prisma.joinRoom(foundedRoom.id, payload);
				// Join the virtual room at the server
				client.join(foundedRoom.name);
				// Add that room to the user's room array of Objects
				this._users.addNewRoom(client.id, foundedRoom, 'USER');
				console.log(this._users.getUserBySocketId(client.id));
			}
			else {
				// If doesn't exist just inform the user
				this._server.to(client.id).emit('error', `Room with ${payload.roomId}:ID not found !`);
			}

		}
		catch (e) {
			// This exeception throws when the user is already there
			this._server.to(client.id).emit('error', `User with ${payload.userId}:ID already exists !`);
		}
	}
};
