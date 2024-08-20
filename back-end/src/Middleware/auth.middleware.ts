// import { Socket } from "socket.io";
// import { Extract } from "passport-jwt"
// import { PrismaService } from "src/PrismaService/prisma.service";
// import { getPrismaClient } from "@prisma/client/runtime/library";
// import { PrismaClient } from "@prisma/client";
// import { Inject, Injectable, NestMiddleware, OnModuleInit, forwardRef } from "@nestjs/common";

// @Injectable()
// export class MiddlewareService implements NestMiddleware {

//     private _prisma :PrismaService;
// 	constructor () {
//         this._prisma = new PrismaService();
//     }

//     // async onModuleInit() {
//     //     setTimeout(() => {
//     //         console.log('Loaded !');
//     //     }, 2000);
//     // }

// 	async use(client: Socket, next: (error?: any) => void) {

//             const { id } = client.handshake.query;

//             console.log(this._prisma);

//             console.log(parseInt(id.toString()));
//             const user = await this._prisma.findUser(parseInt(id.toString()));
//             if (user)
//             {
//                 console.log(user);
//                 next();
//             }
//             else
//             next(new Error('Unauthorized !'));
// 	}
// }

