import { Injectable, OnModuleInit, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request} from 'express';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server , Socket} from "socket.io";
import { Payload } from "src/authentication/dto/payload.message";
import { JwtAuthGuard } from "src/authentication/jwtStrategy/jwtguards";
import { JwtService } from "@nestjs/jwt";
import * as jwt from 'jsonwebtoken';
import { prismaService } from "src/prisma/prisma.service";

@Injectable()
@WebSocketGateway({cors: true,})
export class socketService implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    // public socket: Socket;
    constructor(private prisma: prismaService) {}


    private clients: Map<string, Socket> = new Map<string, Socket>();

    // constructor() {
    //     this.socket = io('http://localhost:3000');
    // }

    // @UseGuards(JwtAuthGuard)
    async handleConnection(client: Socket){
        const token = client.handshake.auth.token;


        // console.log(client.handshake.auth.token);
        if (!token) {
        // Handle unauthorized connection
            client.disconnect();
            return;
            
        }
        try {
            const payload = jwt.verify(token, 'essadike');
            
            // const id : string = payload['id'];
            // console.log("|",id,"|");
            console.log();
            this.clients.set(payload['userName'], client);
            // console.log(this.clients.get('1'))
            console.log(`Client connected: ${client.id} : ${payload['id']}`);

            // this.server.emit('message', {message: client.id, id : payload['userName'] });
        }catch (e) { 
            // Handle unauthorized connection
            console.log(e);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        this.clients.delete(client.id);
        console.log(`Client disconnected: ${client.id}`);
        // this.clients.clear();
    }
    
    @UsePipes(new ValidationPipe({
        whitelist: true,
      }))
    @SubscribeMessage('message')
    handleMessage(client: Socket, payload: Payload): string {
        console.log(client.id, " : ", payload.id);
        
        const recipientClientId = payload.id
        console.log(recipientClientId);
        const recipientClient = this.clients.get(recipientClientId);
        if (recipientClient) {
            recipientClient.emit('message', { message : payload.message});
        }
        else {
            console.log('Client not found!');
        }
        // this.server.emit('onMessage', payload.message);
        return 'Hello world!';
    }


    @SubscribeMessage('typing')
    typing(client: Socket, payload: Payload): string {
        console.log(client.id, " : ", payload.id);
        const recipientClientId = payload.id
        console.log(recipientClientId);
        const recipientClient = this.clients.get(recipientClientId);
        
        if (recipientClient) {
            recipientClient.emit('typing', { message : payload.message});
        }
        else {
            console.log('Client not found!');
        }
        return 'Hello world!';
    }

    // @SubscribeMessage('online')
    // async handleOnline(client: Socket, payload: Payload): string {
    //     const user = await this.prisma.user.update({
    //         where:{
    //             userName: payload.id
    //         },
    //         data:{
    //             online: true
    //         },
    //         select:{
    //             userName: true,
    //             friendRequests: true,
    //         }
    //     })
    //     if (user){
    //         console.log(user);
    //     }
    //     return 'Hello world!';
    // }
}


