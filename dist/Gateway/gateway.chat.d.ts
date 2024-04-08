import { Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { UsersServices } from "./usersRooms/user.class";
import { CreateRoom, JoinRoomDTO, MessageDTO, UpdateStatusRoom } from "./gateway.interface";
import { RoomsServices } from "./usersRooms/room.class";
import { GatewayService } from "./geteway.service";
import { FriendsService } from "src/user/user.service";
import { datagame, gameSocket } from "./gateway.gameclasses";
export declare class serverGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private _users;
    private _rooms;
    private _prisma;
    private FriendsService;
    private _server;
    logger: Logger;
    constructor(_users: UsersServices, _rooms: RoomsServices, _prisma: GatewayService, FriendsService: FriendsService);
    afterInit(): Promise<void>;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleDirectMessage(client: Socket, payload: MessageDTO): Promise<void>;
    handleCreateRoom(client: Socket, payload: CreateRoom): Promise<void>;
    handleJoinRoom(client: Socket, payload: JoinRoomDTO): Promise<void>;
    handleUserStatusInRoom(payload: UpdateStatusRoom): void;
    handleNewFriend(client: Socket, Payload: {
        id: number;
        userId: number;
    }): Promise<void>;
    handleDenyFriend(Payload: {
        id: number;
        userId: number;
    }): Promise<void>;
    handleDeleteFriend(Payload: {
        id: number;
        userId: number;
    }): Promise<void>;
    handleAcceptFriend(Payload: {
        id: number;
        userId: number;
    }): Promise<void>;
    handleNewBlocked(Payload: {
        id: number;
        userId: number;
    }): Promise<void>;
    handleUnBlocked(Payload: {
        id: number;
        userId: number;
    }): Promise<void>;
    deleteRoom(roomId: string): Promise<void>;
    gameRooms: datagame;
    handleJoinRome(client: Socket, lodingdata: {
        userid: number;
        soketid: string;
        type: string;
        friendid: number;
        mode: string;
    }): Promise<void>;
    Game(client: Socket, mydata: gameSocket): Promise<void>;
    gameInvitation(client: Socket, mydata: {
        clientID: number;
        invitationSenderID: number;
        response: boolean;
    }): Promise<void>;
    endGame(client: Socket, mydata: {
        clientid: number;
    }): Promise<void>;
    SendGameInvite(client: Socket, mydata: {
        invitationSenderID: number;
        mode: string;
        friendId: number;
    }): Promise<void>;
}
