import { Module } from '@nestjs/common';
import { AuthMod } from './authentication/authenticaton.module';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { GatewayModule } from './Gateway/gateway.module';


@Module({
  imports: [PassportModule.register({session: true}), ConfigModule.forRoot({isGlobal: true,}) ,AuthMod, UserModule, GameModule, PrismaModule, GatewayModule],
})

export class AppModule {}
