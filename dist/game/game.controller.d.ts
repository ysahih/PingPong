/// <reference types="cookie-parser" />
import { gameService } from "./game.service";
import { Request } from 'express';
export declare class gameController {
    private gameService;
    constructor(gameService: gameService);
    createGame(request: Request): Promise<{
        id: number;
    }>;
    joinGame(request: Request): Promise<{
        id: number;
        users: {
            userName: string;
            id: number;
        }[];
    } | {
        error: string;
    }>;
}
