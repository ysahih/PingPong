import { Body, Logger } from "@nestjs/common";
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { UsersServices } from "./usersRooms/user.class";
import { User } from "./usersRooms/UserRoom.interface";
import { JoinRoomDTO, MessageDTO } from "./gateway.interface";
import { RoomsServices } from "./usersRooms/room.class";


@WebSocketGateway({
	// cors: {
		// origin: ['http://localhost:3000'],
	// },
})
export class serverGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	private _server: Server;
	logger : Logger = new Logger(serverGateway.name);

	constructor(private _users :UsersServices, private _rooms :RoomsServices) {}

	afterInit() :void {
		this.logger.log('The Default gateway succefully started.');
	}

	// TODO: Add Guards for Auth
	handleConnection(client: Socket) :void {

		const { id, username } = client.handshake.query;

		if (typeof id === 'string' && typeof username === 'string')
		{
			const newUser :User = {
				_id: parseInt(id),
				_username: username,
				_socketId: client.id,
			}
			this._users.addUser(client.id, newUser);
			console.log(this._users.getUserBySocketId(client.id));
		}
	}

	handleDisconnect(client: Socket) :void {

		this._users.deleteUser(client.id);
	}

	// TODO: Validate data Format
	@SubscribeMessage('newMessage')
	handleMessage(@ConnectedSocket() client :Socket, @Body() payload :MessageDTO) : void {

		console.log(`${this._users.getUserBySocketId(client.id)._username}: ${payload.message}`);

		if (typeof payload.to === 'number')
			this._server.to(this._users.getUserById(payload.to)._socketId).emit('chat', payload.message);
		else
		{
			// if (this._rooms.getRoomById(payload.to))
			this._server.to(payload.to).emit('chat', payload.message);
			// console.log(this._rooms.getRoomByName(payload.to));
		}
	}

	@SubscribeMessage('createRoom')
	handleCreateRoom(@ConnectedSocket() client :Socket, @Body() payload: JoinRoomDTO) :void {

		try {
			this._rooms.create(payload.roomName, this._users.getUserById(payload.userId));
		} catch (e) {
			client.emit('error', e.message);
		}
	}

	@SubscribeMessage('joinRoom')
	handleJoinRoom(@ConnectedSocket() client: Socket, @Body() payload: JoinRoomDTO) :void {

		try {
			this._rooms.join(payload.roomName, this._users.getUserById(payload.userId));
			this._rooms.printUsersInRoom(payload.roomName);
		} catch (e) {
			console.log('heyy');
			client.emit('error', e.message);
		}
	}
};
