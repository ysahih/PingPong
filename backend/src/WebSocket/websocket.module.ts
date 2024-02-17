import { Module } from "@nestjs/common";
import { socketService } from "./socket.service";
import { JwtAuthGuard } from "src/authentication/jwtStrategy/jwtguards";
import { JwtService } from "@nestjs/jwt";
import { prismaService } from "src/prisma/prisma.service";


@Module({
    providers: [socketService, JwtAuthGuard, prismaService] ,
})
export class WebSocketModule {}
