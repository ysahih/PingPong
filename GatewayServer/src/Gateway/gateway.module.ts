import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { serverGateway } from "./gateway.chat";
import { UsersServices } from "./usersRooms/user.class";
import { RoomsServices } from "./usersRooms/room.class";

@Module({
    providers: [serverGateway, UsersServices, RoomsServices],
})
export class GatewayModule {

    // configure(consumer: MiddlewareConsumer) {
    //     consumer.apply(MiddlewareService)
    //     .forRoutes(serverGateway);
    // }
};