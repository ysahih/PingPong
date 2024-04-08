/// <reference types="node" />
export type gameSocket = {
    clientid: number;
    player: {
        y: number;
    };
    moveball: number;
    player1score: number;
    player2score: number;
};
export type Gameresponse = {
    player1: number;
    player2: number;
    player1score: number;
    player2score: number;
    ball: {
        x: number;
        y: number;
    };
    stop: number;
    gameover: boolean;
};
export type player = {
    opponent: string;
    result: string;
};
export type GameBack = {
    player1: {
        x: number;
        y: number;
    };
    player2: {
        x: number;
        y: number;
    };
    player1score: number;
    player2score: number;
    ball: {
        x: number;
        y: number;
        direction: {
            x: number;
            y: number;
        };
        stop: number;
    };
    gameover: boolean;
};
export type userinfo = {
    clientid: number;
    image: string;
    username: string;
    ingame: boolean;
};
export type RoomInfo = {
    users: userinfo[];
    gameloding: boolean;
    type: string;
    mode: string;
    friendid: number;
};
export declare class datagame {
    angle: number;
    framemove: number;
    rooms: {
        [key: string]: RoomInfo;
    };
    game: {
        [key: string]: GameBack;
    };
    players: {
        [key: string]: player;
    };
    gameIntervals: {
        [room: string]: NodeJS.Timer;
    };
    constructor();
    clearIntervals(room: string): void;
    searchePlayerHistory(clientid: number): player;
    addPlayergame(clientid: number, opponent: string, result: string): void;
    DeleteRoom(room: string): void;
    Deletegame(room: string): void;
    setendgame(room: string): void;
    setmoveball(room: string, moveball: number): void;
    getmoveball(room: string): number;
    initgame(room: string): void;
    newRound(room: string): void;
    updateBall(room: string): void;
    movePlayer(room: string, clientid: number, y: number): void;
    score(room: string): boolean;
    addRoom(data: userinfo, type: string, mode: string, friendid: number): void;
    addUser(roomname: string, user: userinfo): void;
    checkRoomsize(roomname: string): number;
    searcheClientRoom(clientid: number): string;
    searchefriendRoom(friendid: number): string;
    findEmptyRoom(type: string, clientid: number, mode: string): string;
    getRoomsLength(): number;
}
export type UserData = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    userName: string;
    email: string;
    image: string;
    firstName: string;
    lastName: string;
    online: Boolean;
    twoFa: Boolean;
    twoFaCheck: Boolean;
};
