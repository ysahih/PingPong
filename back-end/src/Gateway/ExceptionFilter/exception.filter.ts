import { ArgumentsHost, BadRequestException, Catch } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";
import { Socket } from "socket.io"

@Catch()
export class ExceptionHandler extends BaseWsExceptionFilter {

    catch(exception: BadRequestException | WsException , host: ArgumentsHost) {

        const socket = host.switchToWs().getClient<Socket>();

        if ((exception) instanceof BadRequestException)
            socket.emit('error', exception.getResponse());
        else
            socket.emit('error', exception.message);
    }
}