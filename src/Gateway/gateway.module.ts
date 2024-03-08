import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { serverGateway } from "./gateway.chat";
import { UsersServices } from "./usersRooms/user.class";
import { RoomsServices } from "./usersRooms/room.class";
import { GatewayService } from "./geteway.service";

@Module({
    providers: [serverGateway, UsersServices, RoomsServices, GatewayService],
})
export class GatewayModule {

    // configure(consumer: MiddlewareConsumer) {
    //     consumer.apply(MiddlewareService)
    //     .forRoutes(serverGateway);
    // }
};