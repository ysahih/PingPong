import { Module } from '@nestjs/common';
import { AuthMod } from './authentication/authenticaton.module';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { WebSocketModule } from './WebSocket/websocket.module';


@Module({
  imports: [PassportModule.register({session: true}), ConfigModule.forRoot({isGlobal: true,}) ,AuthMod, UserModule, GameModule, PrismaModule, WebSocketModule, ],
})

export class AppModule {}
