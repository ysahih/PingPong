import { ArgumentsHost, BadRequestException } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";
export declare class ExceptionHandler extends BaseWsExceptionFilter {
    catch(exception: BadRequestException | WsException, host: ArgumentsHost): void;
}
