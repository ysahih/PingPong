import { Module } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/jwtStrategy/jwtguards';
import { prismaService } from 'src/prisma/prisma.service';
import { gameController } from './game.controller';
import { gameService } from './game.service';

@Module({
    controllers: [gameController],
    providers: [prismaService, JwtAuthGuard, gameService],
})
export class GameModule {
}
