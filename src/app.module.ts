import { Module } from '@nestjs/common';
import { AuthMod } from './authentication/authenticaton.module';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { GatewayModule } from './Gateway/gateway.module';
import { UnauthorizedExceptionFilter } from './authentication/dto/Filter';
import { APP_FILTER } from '@nestjs/core';


@Module({
  imports: [PassportModule.register({session: true}), ConfigModule.forRoot({isGlobal: true,}) ,AuthMod, UserModule, GameModule, PrismaModule, GatewayModule],
  providers: [{
    provide: APP_FILTER,
    useClass: UnauthorizedExceptionFilter,
  },],
})

export class AppModule {}
