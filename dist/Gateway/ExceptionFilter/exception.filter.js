"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionHandler = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
let ExceptionHandler = class ExceptionHandler extends websockets_1.BaseWsExceptionFilter {
    catch(exception, host) {
        const socket = host.switchToWs().getClient();
        if ((exception) instanceof common_1.BadRequestException)
            socket.emit('error', exception.getResponse());
        else
            socket.emit('error', exception.message);
    }
};
exports.ExceptionHandler = ExceptionHandler;
exports.ExceptionHandler = ExceptionHandler = __decorate([
    (0, common_1.Catch)()
], ExceptionHandler);
//# sourceMappingURL=exception.filter.js.map