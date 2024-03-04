import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Payload } from "src/authentication/dto/payload.message";
import { prismaService } from "src/prisma/prisma.service";
export declare class socketService implements OnGatewayConnection, OnGatewayDisconnect {
    private prisma;
    server: Server;
    constructor(prisma: prismaService);
    private clients;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleMessage(client: Socket, payload: Payload): string;
    typing(client: Socket, payload: Payload): string;
}
