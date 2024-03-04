import { prismaService } from "src/prisma/prisma.service";
export declare class gameService {
    private prism;
    constructor(prism: prismaService);
    generateGame(UserId: number, name: string): Promise<{
        id: number;
    }>;
    joinGame(gameId: number, UserId: number): Promise<{
        id: number;
        users: {
            userName: string;
            id: number;
        }[];
    } | {
        error: string;
    }>;
}
