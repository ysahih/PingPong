import {
  Body,
  Logger,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UsersServices } from "./usersRooms/user.class";
import { ChatData, CreateRoom, JoinRoomDTO, MessageDTO, UpdateStatusRoom, UserOutDTO } from "./gateway.interface";
import { RoomsServices } from "./usersRooms/room.class";
import { Prisma, ROOMTYPE } from "@prisma/client";
import { ExceptionHandler } from "./ExceptionFilter/exception.filter";
import { GatewayService } from "./geteway.service";
import * as jwt from "jsonwebtoken";
import { FriendsService } from "src/user/user.service";
import { Message } from "@prisma/client";
import { datagame, gameSocket, userinfo , leavegame } from "./gateway.gameclasses";
import { exit } from "process";
import { Console } from "console";
import { Room } from "./usersRooms/UserRoom.interface";

type Invitation = {
  id: number;
  sender: {
    id: number;
    userName: string;
    image: string;
    level: number;
  };
};

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

    const id = await this._users.deleteUser(client, this._rooms.disconnectToRooms);
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
  async handleDirectMessage(@ConnectedSocket() client: Socket, @Body() payload: MessageDTO, method?: boolean) {

    const fromUser = this._users.getUserById(payload.from);

    if (payload.isRoom) {
      const isMuted = await this._prisma.isMuted(payload.to, payload.from);
      if (isMuted)
          return ;
      const room = fromUser.rooms.find(room => room.id === payload.to);
      if (room) {
        const data = await this._prisma.updateConvRoom(payload);
        if (!method)
          client.to(payload.to.toString()).emit('newConvo', data);
        else
          this._users.getUserById(payload.from).socketId.forEach(socketId => this._server.to(socketId).emit('newConvo', data));
      }
    }
    else {
      const isBlocked = await this._prisma.getBlocked(payload.from, payload.to);
      if (isBlocked)
        return ;
      // Get sender User Infos
      // Check if already there's that conversation
      const isExist = fromUser.DirectChat.find((conv) => conv.toUserId === payload.to);
  
      // Check if the receiver user is online between the _users
      const toUser = this._users.getUserById(payload.to);

      if (!isExist) {
          const id = await this._prisma.createConversation(payload);
          this._users.addNewConversation(payload, id.id);
      } else {
        await this._prisma.updateConversation(isExist.id, payload)
      }
  
    
      if (toUser) {
        const data = await this._prisma.getUser(payload.from, payload.message, payload.createdAt);
        toUser.socketId.forEach((socktId: string) => this._server.to(socktId).emit("newConvo", data));
      }
    }
  } 

  @UseFilters(ExceptionHandler)
  @UsePipes(ValidationPipe)
  @SubscribeMessage("joinRoom")
  async handleJoinRoom(@ConnectedSocket() client :Socket, @Body() payload: JoinRoomDTO): Promise<void> {

    // console.log("Payload:", payload);
    // console.log(this._users.getUserById(payload.userId));
    // Check if the room already exists in the map
    if (this._users.getUserById(payload.userId).rooms.findIndex(room => room.name === payload.room.name) >= 0)
      return ;

    // Check if the room Exists in DB
    const foundedRoom = await this._prisma.findRoom(payload.room.id, payload.userId);

    // console.log("Founded:", JSON.stringify(foundedRoom, null, 2));

    // Brodcast that there's a new user in the room and add it the it's room data
    if (foundedRoom.users.length) {

      // TODO: I have to emit all users in the room to say that there's an new user
      // console.log("Entered!");

      this._users.addNewRoom(payload.userId, payload.room);
      
      this._users.getUserById(payload.userId).socketId?.forEach(socketId => {
        this._server.sockets.sockets.get(socketId).join(payload.room.id.toString());
        // this._server.sockets.sockets.get(socketId).join(payload.room.name);
      });

      client.to(payload.room.id.toString()).emit('newJoin', {
      // client.to(payload.room.name).emit("newJoin", {
          userId: payload.userId,
          roomId: foundedRoom.id,
          userName: foundedRoom.users[0].user.userName,
          roomName: foundedRoom.name,
          image: foundedRoom.users[0].user.image,
          isMuted: false,
          role: 'USER',
      });
      this.handleDirectMessage(client, {
        createdAt: new Date(1970, 0, 1, 0, 0, 0, 0),
        from: payload.userId,
        to: payload.room.id,
        isRoom: true,
        message: '',
      },
      true);
      // this._rooms.connectToRoom(this._server, this._users.getUserById(payload.userId).socketId, payload.room.name);
    }
  }

  @UseFilters(ExceptionHandler)
  @UsePipes(ValidationPipe)
  @SubscribeMessage('createRoom')
  async handleCreateRoom(@ConnectedSocket() client: Socket, @Body() payload :{ownerId: number, roomId: number}) {

    const checkOwner = await this._prisma.findRoom(payload.roomId, payload.ownerId);
    const owner = this._users.getUserById(payload.ownerId);
    const findRoom = owner.rooms.find(room => room.id === payload.roomId);
    
    if (checkOwner?.users[0].userRole === 'OWNER' && !findRoom) {
      owner.rooms.push({
        id: payload.roomId,
        name: checkOwner.name,
        type: checkOwner.type,
        UserRole: 'OWNER',
      });
      client.join(payload.roomId.toString());

      this.handleDirectMessage(client, {
          createdAt: new Date(1970, 0, 1, 0, 0, 0, 0),
          from: payload.ownerId,
          to: payload.roomId,
          isRoom: true,
          message: '',
        },
      true);
    }
  }

  @UseFilters(ExceptionHandler)
  @UsePipes(ValidationPipe)
  @SubscribeMessage('userStatusInRoom')
  handleUserStatusInRoom(@ConnectedSocket() client: Socket, @Body() payload :UpdateStatusRoom) {

    // Check if the User who made changes is in the room an return the data
    const UserInRoom = this._users.getUserById(payload.fromId).rooms.find((room) => room.id === payload.roomId);

    // Check if the user has the Admin role
    if (UserInRoom && UserInRoom.UserRole !== 'USER') {
      const user = this._users.getUserById(payload.userId);
      if (user) {
        user.rooms.find(room => room.id === payload.roomId).UserRole = payload.role;
        // Emit this event when the user is muted
        user.socketId.forEach(socketId => this._server.to(socketId).emit('access', {
          from: payload.roomId,
          access: payload.isMuted,
          isRoom: true,
        }))
      }
      client.to(payload.roomId.toString()).emit("UpdateStatus", {
      // client.to(payload.roomName).emit("UpdateStatus", {
        userId: payload.userId,
        roomId: payload.roomId,
        role: payload.role,
        isMuted: payload.isMuted,
      });
    }
  }

  @UseFilters(ExceptionHandler)
  @UsePipes(ValidationPipe)
  @SubscribeMessage('changeOwner')
  async handleOwnerChnage(@ConnectedSocket() client: Socket, @Body() payload :{roomId: number, ownerId: number, userId: number}) {

    const checkOwner = await this._prisma.findRoom(payload.roomId, payload.ownerId);
    const checkUser = await this._prisma.findRoom(payload.roomId, payload.userId);

    if (checkOwner?.users[0]?.user?.id === payload.ownerId && checkOwner?.users[0]?.userRole === 'OWNER' && !checkUser.users.length) {

      const owner = this._users.getUserById(payload.ownerId);

      if (owner)
        owner.rooms.find(room => room.id === payload.roomId).UserRole = 'OWNER';

      // this._server.to(checkOwner?.name).emit("UpdateStatus", {
      this._server.to(payload.roomId.toString()).emit("UpdateStatus", {
        userId: payload.ownerId,
        roomId: payload.roomId,
        role: 'OWNER',
        isMuted: false,
      });
    }
  }

  @UseFilters(ExceptionHandler)
  @UsePipes(ValidationPipe)
  @SubscribeMessage('userOut')
  async handleUserOut(@ConnectedSocket() client :Socket, @Body() payload :UserOutDTO) {

    const user = this._users.getUserById(payload.userId);
    const room = await this._prisma.findRoom(payload.roomId, payload.userId);
    const adminRoom = this._users.getUserById(payload.adminId).rooms.find((room) => payload.roomId === room.id);

    // Check if the user is really isn't the room again and if the admin is connected
    if (!room?.users?.length && (adminRoom?.UserRole !== 'USER' || payload.adminId === payload.userId)) {

      client.to(payload.roomId.toString()).emit('kickBanUser', {userId: payload.userId, roomId: payload.roomId});
      // client.to(payload.roomName).emit('kickBanUser', {roomName: payload.roomName, userId: payload.userId, roomId: payload.roomId});

      if (user) {
        // Make all the sockets of the client leave
        user.socketId.forEach((socketId) => {
            this._server.sockets.sockets.get(socketId).leave(payload.roomId.toString());
        });
        // Remove the room from the user data
        user.rooms.splice(user.rooms.findIndex((room) => room.id === payload.roomId), 1);
        // client.leave(payload.roomName);
      }
    }
  }

  @UseFilters(ExceptionHandler)
  @UsePipes(ValidationPipe)
  @SubscribeMessage("deleteRoom")
  async handleDeleteRoom(@ConnectedSocket() client: Socket, @Body() payload: {ownerId: number, roomId: number}) {

    const room = await this._prisma.findRoom(payload.roomId, payload.ownerId);
    const owner = this._users.getUserById(payload.ownerId);
    const checkInRoom = owner.rooms.find(room => room.id === payload.roomId);

    // console.log('Room:', room);

    // TODO:
    // 1. Chekc if thre room doesn't exist anymore
    // 2. check in the cache if the user was an owner
    // 3. broadcast to all users leave the room
    // 3. make all sockets leaves the room

    if (!room && checkInRoom?.UserRole === 'OWNER') {
      const allClients = await this._server.in(payload.roomId.toString()).fetchSockets();
      // console.log(allClients);

      client.to(payload.roomId.toString()).emit('deleted', {roomId: payload.roomId});
      this._server.socketsLeave(payload.roomId.toString());

      for (const socket of allClients) {
        const user = await this._users.getUserBySocket(socket.id);
        user.rooms = user.rooms.filter(room => room.id !== payload.roomId);
      }
    }
  }
  
  @UseFilters(ExceptionHandler)
  @UsePipes(ValidationPipe)
  @SubscribeMessage("roomTypeChange")
  async RoomData(@ConnectedSocket() client: Socket, @Body() payload: {adminId: number, roomId: number, type: ROOMTYPE}): Promise<void> {

    // console.log(payload);

    const adminChekcer = this._users.getUserById(payload.adminId);
    const room = adminChekcer.rooms.find(room => room.id === payload.roomId);

    if (room?.UserRole === 'OWNER') {
      client.to(payload.roomId.toString()).emit('roomType', {
        roomId: payload.roomId,
        // name: payload?.name,
        type: payload?.type,
      });
    }

    // to.forEach((socketId :string) => {
    //   this._server.to(socketId).emit("isTyping", {from: data.from});
    // });
  }

  @UseFilters(ExceptionHandler)
  @UsePipes(ValidationPipe)
  @SubscribeMessage("roomInvite")
  async roomInvite(@ConnectedSocket() client: Socket, @Body() payload: {adminId: number, roomId: number, userId: number}): Promise<void> {

    // console.log(payload);

    const check = await this._prisma.getInvite(payload.userId, payload.roomId);
    const checkInRoom = this._users.getUserById(payload.adminId).rooms.find(room => room.id === payload.roomId);
    const user = this._users.getUserById(payload.userId);
    const checkUser = user.rooms.find(room => room.id === payload.roomId);

    // console.log(check);
    // console.log(checkInRoom);

    if (check.invites[0] && checkInRoom && !checkUser) {
      user.socketId.forEach(socketId => this._server.to(socketId).emit('newRoom', {
        id: check.id,
        name: check.name,
        image: check.image,
      }));
    }
  }

  @UseFilters(ExceptionHandler)
  @UsePipes(ValidationPipe)
  @SubscribeMessage("typing")
  async handleTyping(@ConnectedSocket() client: Socket, @Body() data: {from: number, to: number}): Promise<void> {

    // console.log("HELLO");
    const to = this._users.getUserById(data.to).socketId;

    to.forEach((socketId :string) => {
      this._server.to(socketId).emit("isTyping", {from: data.from});
    });
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
    const notifications = await this.FriendsService.newNotification(Payload.id, targetFriend.sender.userName, targetFriend.sender.image, "sent you a friend request");
	  const newInvit: Invitation = {
		id: targetFriend.id,
		sender: {
		  id: targetFriend.sender.id,
		  userName: targetFriend.sender.userName,
		  image: targetFriend.sender.image,
      level: targetFriend.sender.level,
		},
	  };
	  const Sockets = this._users.getUserById(Payload.id);
	  if (Sockets) {
		Sockets.socketId.forEach((socktId: string) => {
		  this._server.to(socktId).emit("NewInvit", newInvit);
      notifications && this._server.to(socktId).emit("Notification", notifications);
		});
		// console.log(" newInvet from :", targetFriend.sender);
	  }
	}
  }

  @SubscribeMessage("DenyFriend")
  async handleDenyFriend(@Body() Payload: { id: number; userId: number }) {
    const targetFriend = await this.FriendsService.deleteFriendRequest(
      Payload.userId,
      Payload.id
    );
    // console.log("deny : ", targetFriend, Payload.id, Payload.userId);
    if (targetFriend !== null) {
      const SocketsTarget = this._users.getUserById(Payload.userId);
      if (SocketsTarget) {
        SocketsTarget.socketId.forEach((socktId: string) => {
          this._server.to(socktId).emit("DeleteInvit", Payload.id);
        });
      }
    }

  }

  @SubscribeMessage("DeleteFriend")
  async handleDeleteFriend(@Body() Payload: { id: number; userId: number }) {
    const targetFriend = await this.FriendsService.deleteFriendRequest(
      Payload.id,
      Payload.userId,
    );
    // console.log("deny : ", targetFriend, Payload.id, Payload.userId);
    if (targetFriend !== null) {
      const SocketsTarget = this._users.getUserById(Payload.id);
      if (SocketsTarget) {
        SocketsTarget.socketId.forEach((socktId: string) => {
          this._server.to(socktId).emit("DeleteInvit", Payload.userId);
        });
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
    const notifications = await this.FriendsService.newNotification(Payload.id, targetFriend.sender.userName, targetFriend.sender.image, "accepted your friend request");

	  const SocketsTarget = this._users.getUserById(Payload.id);
	  if (SocketsTarget) {
		SocketsTarget.socketId.forEach((socktId: string) => {
		  this._server.to(socktId).emit("NewFriend", targetFriend.sender);
      notifications && this._server.to(socktId).emit("Notification", notifications);
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
    // console.log('-----BLOCK:-----')
    // console.log(Payload.id, Payload.userId);
    // console.log('------------------');
	const targetFriend = await this.FriendsService.blockFriendRequest(
	  Payload.userId,
	  Payload.id
	);
  // console.log("blocked", targetFriend);
	if (!targetFriend) return
	  const SocketsTarget = this._users.getUserById(Payload.id);
	  if (SocketsTarget) {
		SocketsTarget.socketId.forEach((socktId: string) => {
		  this._server.to(socktId).emit("DeleteFriend", Payload.userId);
      this._server.to(socktId).emit('access', {
          from: Payload.userId,
          access: true,
          isRoom: false,
        });
		});
	  }
	  const client = this._users.getUserById(Payload.userId);
	  if (client) {
		client.socketId.forEach((socktId: string) => {
		  this._server.to(socktId).emit("NewBlocked", targetFriend);
      this._server.to(socktId).emit('access', {
        from: Payload.id,
        access: true,
        isRoom: false,
      });
		});
	}
  }

  @SubscribeMessage("UnBlocked")
  async handleUnBlocked(@Body() Payload: { id: number; userId: number }) {
	const targetFriend = await this.FriendsService.unblockFriendRequest(
	  Payload.userId,
	  Payload.id
	);
	if (targetFriend !== null) {
	  const SocketsTarget = this._users.getUserById(Payload.id);
	  if (SocketsTarget) {
	    SocketsTarget.socketId.forEach((socktId: string) => {
	      // this._server.to(socktId).emit("UnBlocked", Payload.userId);
        this._server.to(socktId).emit('access', {
          from: Payload.userId,
          access: false,
          isRoom: false,
        });
	    });
	  }
	  // console.log("unblocked", targetFriend);
	  
	  const client = this._users.getUserById(Payload.userId);
	  if (client) {
		client.socketId.forEach((socktId: string) => {
		  this._server.to(socktId).emit("UnBlocked", Payload.id);
      this._server.to(socktId).emit('access', {
        from: Payload.id,
        access: false,
        isRoom: false,
      });
		});
	  }
	}
  }

/**
   * end of functions :by essadike
   */
  
  async deleteRoom(roomId: string) {
    const roomSockets = await this._server.in(roomId).fetchSockets();
    roomSockets.forEach(socket => {
      socket.leave(roomId);
    });
    // console.log(`Room ${roomId} deleted.`);
  }


  async GameStatus(ids: number[], status: boolean, curentroom: string) {
    const statuss = await this.FriendsService.setGameStatus(ids, status);
      if (statuss)
        {
          const SocketsTarget = this._users.getAllSocketsIds();
          if (SocketsTarget) 
          {
            SocketsTarget.forEach((socktId: string) => 
              {
                // console.log("gameStatus", status);
                this._server.to(socktId).emit("gameStatus",{ id: this.gameRooms.rooms[curentroom].users[0].clientid , status: status});
                if (this.gameRooms.rooms[curentroom].type != "ai")
                this._server.to(socktId).emit("gameStatus",{ id: this.gameRooms.rooms[curentroom].users[1].clientid , status: status});
              });
          }
      }
  }

  public  gameRooms : datagame = new datagame();
		@SubscribeMessage('RandomGameroom')
    	async  handleJoinRome(@ConnectedSocket () client: Socket , @Body() lodingdata: {userid : number , soketid : string , type : string , friendid : number , mode : string} ):Promise<void> {
				
				let user: userinfo ;
				try {
					const base = await this._prisma.userInfogame(lodingdata.userid);
					user = {
                    clientid: lodingdata.userid,
                    image: base.image,
                    username: base.userName ,
                    ingame: false ,
                    level : base.level ,
                    achievenemt : base.achievement ,
                    numberofWin : base.winCounter,
                    mode : lodingdata.mode
                }
				} catch (error) {
					console.error("Error fetching user info:", error);
				}
				let curentroom = this.gameRooms.searcheClientRoom(lodingdata.userid) ;
				// console.log(1);
				if ( !curentroom )
				{
					curentroom = this.gameRooms.findEmptyRoom(lodingdata.type , lodingdata.userid );
					try{
					if (!curentroom)
					{
						// console.log(2);
						this.gameRooms.addRoom(user , lodingdata.type ,lodingdata.friendid);	
            curentroom =  this.gameRooms.searcheClientRoom(lodingdata.userid)
            if (lodingdata.type == "ai")
            {
              
              const ids : number[] = [this.gameRooms.rooms[curentroom].users[0].clientid , this.gameRooms.rooms[curentroom].users[1].clientid];
              this.GameStatus(ids, true, curentroom);
            }
					}
					else
					{
						// console.log(3);
						this.gameRooms.addUser(curentroom, user);
            const ids : number[] = [this.gameRooms.rooms[curentroom].users[0].clientid , this.gameRooms.rooms[curentroom].users[1].clientid];
            // console.log("ids", ids);
            this.GameStatus(ids, true, curentroom);
					}

					}
					catch (error) {
						console.error("Error fetching user info:", error);
					}
				}
				// join game
				else  if ( curentroom && (this.gameRooms.checkRoomsize(curentroom) === 2 ))
				{ 
					// console.log(4);
					client.join(curentroom);

					this._server.to(curentroom).emit('RandomGameroom',{ room: this.gameRooms.rooms[curentroom] , alreadymatch: true });
					return ;
				}
				// join game
				client.join(curentroom);
        // console.log("curentroom", curentroom);
				if ( curentroom && (this.gameRooms.checkRoomsize(curentroom) === 2 ))
				{
					// console.log(5);
					this._server.to(curentroom).emit('RandomGameroom' ,{ room: this.gameRooms.rooms[curentroom] , alreadymatch: false  });
				}
			}


			@SubscribeMessage('game')
			async Game(@ConnectedSocket() client: Socket, @MessageBody() mydata: gameSocket ) {	

			var room = this.gameRooms.searcheClientRoom(mydata.clientid);
       
			if (!room)
			{
				// console.log("room not found");
				return ;
			}
			client.join(room);
			this.gameRooms.movePlayer(room, mydata.clientid, mydata.player.y);
			if (mydata.player1score + mydata.player2score != this.gameRooms.game[room].player1score + this.gameRooms.game[room].player2score)
			{
				mydata.moveball = 0;
				return ;
			}
			this.gameRooms.setmoveball(room, mydata.moveball);
			if (!this.gameRooms.gameIntervals[room]) 
      {
        // console.log("create interval");
				this.gameRooms.gameIntervals[room] = setInterval(async () => {
          if(!this.gameRooms.game[room])
          {
              this.gameRooms.clearIntervals(room);
            // console.log("game not found");
            return ;
          }
					if ((this.gameRooms.game[room].player1score >= 7 ||  this.gameRooms.game[room].player2score >= 7) && this.gameRooms.game[room].gameoverHandled == false)
					{
            this.gameRooms.setgameoverHandled(room);
            this.gameRooms.newRound(room);
            this.gameRooms.setmoveball(room, 0);
            const user1 = this.gameRooms.rooms[room].users[0].clientid;
            const user2 = this.gameRooms.rooms[room].users[1].clientid;
            if (this.gameRooms.game[room].player1score == 7 && this.gameRooms.rooms[room].type != "ai")
            {
              this.gameRooms.updatelevel(room , user1)
              const level =  this.gameRooms.rooms[room].users[0].level  
              await this.FriendsService.updateResult(user1, user2, "W"  , level);
              await this.FriendsService.updateResult(user2, user1, "L"  );
              this.gameRooms.rooms[room].users[0].numberofWin += 1;
               await this.gameRooms.AssignAchievement(user1 ,0  , room  ,   this.FriendsService.updateAchievement.bind(this.FriendsService));
            }
            else if ( this.gameRooms.rooms[room].type != "ai")
            {
              this.gameRooms.updatelevel(room , user2)
              const level =  this.gameRooms.rooms[room].users[1].level          
              await this.FriendsService.updateResult(user1, user2, "L" );
              await this.FriendsService.updateResult(user2, user1, "W" , level );
              this.gameRooms.rooms[room].users[1].numberofWin += 1;
              
              await  this.gameRooms.AssignAchievement(user2 ,1  , room  ,   this.FriendsService.updateAchievement.bind(this.FriendsService));
            }
						this.gameRooms.clearIntervals(room);

            if (this.gameRooms.rooms[room])
            {
              // console.log("gmae over")
              const ids : number[] = [this.gameRooms.rooms[room].users[0].clientid , this.gameRooms.rooms[room].users[1].clientid];
              await this.GameStatus(ids, false, room);

            }

						this.gameRooms.DeleteRoom(room);
						this.gameRooms.Deletegame(room);
            this.deleteRoom(room);
					}
          else if (this.gameRooms.game[room].player1score < 7 &&  this.gameRooms.game[room].player2score < 7)
          {
            this.gameRooms.updateBall(room);
            if (this.gameRooms.score(room))
            {
              if (this.gameRooms.game[room].player1score < 7 &&  this.gameRooms.game[room].player2score < 7)
              this.gameRooms.newRound(room);
              else 
              this.gameRooms.setendgame(room);
            }
            mydata.moveball = this.gameRooms.getmoveball(room);
            this._server.to(room).emit('game', 
            {
              player1: this.gameRooms.game[room].player1.y,
              player2: this.gameRooms.game[room].player2.y,
              player1score: this.gameRooms.game[room].player1score,
              player2score: this.gameRooms.game[room].player2score,
              ball: this.gameRooms.game[room].ball,
              stop: mydata.moveball,
              gameover: this.gameRooms.game[room].gameover,
              iscollision: this.gameRooms.game[room].iscollision,
              colormode: this.gameRooms.game[room].colormode,
            });
          }
			} , 15)
    }
		}



    @SubscribeMessage('gameInvitation')
		async gameInvitation(@ConnectedSocket() client: Socket, @MessageBody () mydata: { clientID : number ,  invitationSenderID : number ,  response: boolean }) {	
  
      let user: userinfo ;
				try {
					const base = await this._prisma.userInfogame(mydata.clientID );
					user = {clientid: mydata.clientID , image: base.image, username: base.userName , ingame: false , level : base.level , achievenemt : base.achievement , numberofWin : base.winCounter , mode : "Dark Valley"}
				} catch (error) {
					console.error("Error fetching user info:", error);
				}
      var room = this.gameRooms.searcheClientRoom(mydata.invitationSenderID);
      const SocketsTarget = this._users.getUserById(mydata.invitationSenderID);
      if (SocketsTarget) 
      {
        if (mydata.response == true)
        {
          SocketsTarget.socketId.forEach((socktId: string) => 
            {
              
              this._server.to(socktId).emit("gameresponse", {username : user.username , userimage : user.image  , message :  "accept game invitation" , response : true , type : "friend"});
            });
        }
        else if (mydata.response == false)
        {
          this.deleteRoom(room);
          this.gameRooms.DeleteRoom(room);
          this.gameRooms.Deletegame(room);
          client.leave(room);
          if (this.gameRooms.gameIntervals[room]) {
          this.gameRooms.clearIntervals(room);
          }
          SocketsTarget.socketId.forEach((socktId: string) => 
            {         
              this._server.to(socktId).emit("gameresponse", {username : user.username , userimage : user.image  , message :  "reject game invitation" ,  response : false , type : "friend"});
            }); 
        }
      }
		}


    @SubscribeMessage('endGame')
		async endGame(@ConnectedSocket() client: Socket, @MessageBody () mydata: { clientid: number }) {	
      var room = this.gameRooms.searcheClientRoom(mydata.clientid);
      if (!room)
      {
        return ;
      }
      // console.log("ids---------", this.gameRooms.rooms[room].users.length);
      if (this.gameRooms.rooms[room].users.length == 2)
      {
        const ids : number[] = [this.gameRooms.rooms[room].users[0].clientid , this.gameRooms.rooms[room].users[1].clientid];
        
        const status = await this.FriendsService.setGameStatus(ids, false);
        if (status)
          {
            const SocketsTarget = this._users.getAllSocketsIds();
            if (SocketsTarget) 
            {
              SocketsTarget.forEach((socktId: string) => 
                {
                  this._server.to(socktId).emit("gameStatus",{ id: this.gameRooms.rooms[room].users[1].clientid , status: false});
                  this._server.to(socktId).emit("gameStatus",{ id: this.gameRooms.rooms[room].users[0].clientid , status: false});
                });
            }
        }
    }
      this.gameRooms.DeleteRoom(room);
      this.gameRooms.Deletegame(room);
      this.deleteRoom(room);
		}

    @SubscribeMessage('SendGameInvite')
		async SendGameInvite(@ConnectedSocket() client: Socket, @MessageBody () mydata: { invitationSenderID: number , mode : string ,friendId : number }) {	
     
      try {
        const SocketsTarget = this._users.getUserById(mydata.friendId);
        const blocked = await this.FriendsService.SearchCantShow(mydata.invitationSenderID);
        if (blocked && blocked.length > 0 && blocked.findIndex((element) => element.id === mydata.friendId) != -1)
        {
          return ;
        }
        
        // console.log("SendGameInvite", mydata);
        let user: userinfo ;
        try {
            const base = await this._prisma.userInfogame(mydata.invitationSenderID);


            user = {clientid: mydata.invitationSenderID, image: base.image, username: base.userName , ingame: false , level : base.level , achievenemt : base.achievement , numberofWin : base.winCounter , mode : mydata.mode}
          } catch (error) {
            console.error("Error fetching user info:", error);
            return;
          }
        if (SocketsTarget) 
        {
          let friendroon = this.gameRooms.searcheClientRoom(mydata.friendId);
          let curentroom = this.gameRooms.searcheClientRoom(mydata.invitationSenderID);
          if( !curentroom &&!friendroon)
          {
              this.gameRooms.addRoom( {clientid : mydata.invitationSenderID, image: user.image, username: user.username , ingame: false , level : user.level , achievenemt : user.achievenemt ,numberofWin : user.numberofWin , mode : mydata.mode}  , "friend" , mydata.friendId);
              SocketsTarget.socketId.forEach((socktId: string) => 
              {
                this._server.to(socktId).emit("gameInvitation", {  invitationSenderID  : mydata.invitationSenderID , username : user.username , userimage : user.image  , message : "game invitation from" , mode : mydata.mode , type : "friend"});
              });
            }
        }
      }catch (error) {
        
      }
    }

    @SubscribeMessage('LeaveGame')
		async LeaveGame(@ConnectedSocket() client: Socket, @MessageBody () leaveGame: { clientid: number }) {	
      var room = this.gameRooms.searcheClientRoom(leaveGame.clientid);
      if (!room)
      {
        return ;
      }
      
      var user1  : number;
      var user2 : number;
      var user1index : number
      var user2index : number
      let response : leavegame = { id : leaveGame.clientid }

      this._server.to(room).emit('LeaveGame', response);
      if ( leaveGame.clientid == this.gameRooms.rooms[room].users[0].clientid)
      {
        user1 = this.gameRooms.rooms[room].users[0].clientid;
        user2 = this.gameRooms.rooms[room].users[1].clientid;
        user1index = 0;
        user2index = 1;
      }
      else
      {
        user1 = this.gameRooms.rooms[room].users[1].clientid;
        user2 = this.gameRooms.rooms[room].users[0].clientid;
        user1index = 1;
        user2index = 0;
      }
      if (this.gameRooms.rooms[room].users.length == 2)
        {
          const ids : number[] = [user1 , user2];
          const status = await this.FriendsService.setGameStatus(ids, false);
          if (status)
          {
            const SocketsTarget = this._users.getAllSocketsIds();
            if (SocketsTarget) 
            {
              SocketsTarget.forEach((socktId: string) => 
              {
                this._server.to(socktId).emit("gameStatus",{ id: user1, status: false});
                if (this.gameRooms.rooms[room].type != "ai")
                  this._server.to(socktId).emit("gameStatus",{ id: user2 , status: false});
              });
            }
          }
    }
    if ( this.gameRooms.rooms[room].type != "ai")
    {            
      this.gameRooms.updatelevel(room , user2)
      const level =  this.gameRooms.rooms[room].users[user2index].level
      await this.FriendsService.updateResult(user2, user1, "W"  , level);
      await this.FriendsService.updateResult(user1, user2, "L"  );
      this.gameRooms.rooms[room].users[user2index].numberofWin += 1;
      await this.gameRooms.AssignAchievement(user2 ,user2index  , room  ,   this.FriendsService.updateAchievement.bind(this.FriendsService));
    }
      this.gameRooms.clearIntervals(room);
      this.gameRooms.DeleteRoom(room);
      this.gameRooms.Deletegame(room);
      this.deleteRoom(room);
    }

}
