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
import { ChatData, CreateRoom, JoinRoomDTO, MessageDTO, UpdateStatusRoom } from "./gateway.interface";
import { RoomsServices } from "./usersRooms/room.class";
import { Prisma } from "@prisma/client";
import { ExceptionHandler } from "./ExceptionFilter/exception.filter";
import { GatewayService } from "./geteway.service";
import * as jwt from "jsonwebtoken";
import { FriendsService } from "src/user/user.service";

import { Message } from "@prisma/client";
import { RoomInfo, datagame, gameSocket, userinfo } from "./gateway.gameclasses";
import { exit } from "process";

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
    {
      const lastMessage :ChatData = await this._prisma.uniqueConvo(payload.from, payload.to);
      toUser.socketId.forEach((socktId: string) =>
        this._server.to(socktId).emit("newConvo", lastMessage)
      );
    }
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

  @UseFilters(ExceptionHandler)
  @UsePipes(ValidationPipe)
  @SubscribeMessage('userStatusInRoom')
  handleUserStatusInRoom(@Body() payload :UpdateStatusRoom) {

    console.log(payload);
    const user = this._users.getUserById(payload.userId);
    console.log(user);
    if (user)
      user.socketId.forEach((socketId :string) => this._server.to(socketId).emit("UpdateStatus", payload));
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
		},
	  };
	  const Sockets = this._users.getUserById(Payload.id);
	  if (Sockets) {
		Sockets.socketId.forEach((socktId: string) => {
		  this._server.to(socktId).emit("NewInvit", newInvit);
      notifications && this._server.to(socktId).emit("Notification", notifications);
		});
		console.log(" newInvet from :", targetFriend.sender);
	  }
	}
  }

  @SubscribeMessage("DenyFriend")
  async handleDenyFriend(@Body() Payload: { id: number; userId: number }) {
    const targetFriend = await this.FriendsService.deleteFriendRequest(
      Payload.userId,
      Payload.id
    );
    console.log("deny : ", targetFriend, Payload.id, Payload.userId);
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
    console.log("deny : ", targetFriend, Payload.id, Payload.userId);
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
	const targetFriend = await this.FriendsService.blockFriendRequest(
	  Payload.userId,
	  Payload.id
	);
  console.log("blocked", targetFriend);
	if (!targetFriend) return
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
  
  async deleteRoom(roomId: string) {
    const roomSockets = await this._server.in(roomId).fetchSockets();
    roomSockets.forEach(socket => {
      socket.leave(roomId);
    });
    console.log(`Room ${roomId} deleted.`);
  }


  public  gameRooms : datagame = new datagame();
		@SubscribeMessage('RandomGameroom')
    	async  handleJoinRome(@ConnectedSocket () client: Socket , @Body() lodingdata: {userid : number , soketid : string , type : string , friendid : number , mode : string} ):Promise<void> {
				
				let user: userinfo ;
				try {
					const base = await this._prisma.userInfogame(lodingdata.userid);
					user = {clientid: lodingdata.userid, image: base.image, username: base.userName , ingame: false}
				} catch (error) {
					console.error("Error fetching user info:", error);
				}
				let curentroom = this.gameRooms.searcheClientRoom(lodingdata.userid) ;
				console.log(1);
				if ( !curentroom )
				{
					curentroom = this.gameRooms.findEmptyRoom(lodingdata.type , lodingdata.userid , lodingdata.mode);
					try{
					if (!curentroom)
					{
						console.log(2);
						this.gameRooms.addRoom(user , lodingdata.type , lodingdata.mode ,lodingdata.friendid);	
            curentroom =  this.gameRooms.searcheClientRoom(lodingdata.userid)
					}
					else
					{
						console.log(3);
						this.gameRooms.addUser(curentroom, user);
					}
					}
					catch (error) {
						console.error("Error fetching user info:", error);
					}
				}
				// join game
				else  if ( curentroom && (this.gameRooms.checkRoomsize(curentroom) === 2 ))
				{ 
					console.log(4);
					client.join(curentroom);
					this._server.to(curentroom).emit('RandomGameroom',{ room: this.gameRooms.rooms[curentroom] , alreadymatch: true});
					return ;
				}
				// join game
				client.join(curentroom);
        console.log("curentroom", curentroom);
				if ( curentroom && (this.gameRooms.checkRoomsize(curentroom) === 2 ))
				{
					console.log(5);
					this._server.to(curentroom).emit('RandomGameroom' ,{ room: this.gameRooms.rooms[curentroom] , alreadymatch: false });
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
			if (!this.gameRooms.gameIntervals[room]) {
       
				this.gameRooms.gameIntervals[room] = setInterval(async () => {
          if(!this.gameRooms.game[room])
          {
              this.gameRooms.clearIntervals(room);
            // console.log("game not found");
            return ;
          }
					if (this.gameRooms.game[room].player1score == 7 ||  this.gameRooms.game[room].player2score == 7)
					{
            
						this.gameRooms.clearIntervals(room);
						this.gameRooms.DeleteRoom(room);
						this.gameRooms.Deletegame(room);
            this.deleteRoom(room);
						return ;
					}			
					this.gameRooms.updateBall(room);
					if (this.gameRooms.score(room))
					{
						if (this.gameRooms.game[room].player1score < 7 &&  this.gameRooms.game[room].player2score < 7)
						this.gameRooms.newRound(room);
						else 
						this.gameRooms.setendgame(room);
					}
					mydata.moveball = this.gameRooms.getmoveball(room);
					this._server.to(room).emit('game', {
						player1: this.gameRooms.game[room].player1.y,
						player2: this.gameRooms.game[room].player2.y,
						player1score: this.gameRooms.game[room].player1score,
						player2score: this.gameRooms.game[room].player2score,
						ball: this.gameRooms.game[room].ball,
						stop: mydata.moveball,
						gameover: this.gameRooms.game[room].gameover
					});


			} , 15)}
		}




    @SubscribeMessage('gameInvitation')
		async gameInvitation(@ConnectedSocket() client: Socket, @MessageBody () mydata: { clientID : number ,  invitationSenderID : number ,  response: boolean }) {	
  
      let user: userinfo ;
				try {
					const base = await this._prisma.userInfogame(mydata.clientID );
					user = {clientid: mydata.clientID , image: base.image, username: base.userName , ingame: false}
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
              
              this._server.to(socktId).emit("gameresponse", {username : user.username , userimage : user.image  , message :  "accept game invitation" , response : true});
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
                
              this._server.to(socktId).emit("gameresponse", {username : user.username , userimage : user.image  , message :  "reject game invitation" ,  response : false});
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
      this.gameRooms.DeleteRoom(room);
      this.gameRooms.Deletegame(room);
      this.deleteRoom(room);
		}

    @SubscribeMessage('SendGameInvite')
		async SendGameInvite(@ConnectedSocket() client: Socket, @MessageBody () mydata: { invitationSenderID: number , mode : string ,friendId : number }) {	
     
      const SocketsTarget = this._users.getUserById(mydata.friendId);
      let user: userinfo ;
      try {
					const base = await this._prisma.userInfogame(mydata.invitationSenderID);
					user = {clientid: mydata.invitationSenderID, image: base.image, username: base.userName , ingame: false}
				} catch (error) {
					console.error("Error fetching user info:", error);
          return;
				}
      if (SocketsTarget) 
      {
        let friendroon = this.gameRooms.searchefriendRoom(mydata.friendId);
        let curentroom = this.gameRooms.searcheClientRoom(mydata.invitationSenderID);
        if( !curentroom &&!friendroon)
        {
            this.gameRooms.addRoom( {clientid : mydata.invitationSenderID, image: user.image, username: user.username , ingame: false} , mydata.mode , "friend" , mydata.friendId);
            SocketsTarget.socketId.forEach((socktId: string) => 
            {
              this._server.to(socktId).emit("gameInvitation", {  invitationSenderID  : mydata.invitationSenderID , username : user.username , userimage : user.image  , message : "game invitation from" , mode : mydata.mode });
            });
          }
      }
    }

  
}
