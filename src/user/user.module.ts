import { Module } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/jwtStrategy/jwtguards';
import { prismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    controllers:[UserController],
    providers:[prismaService, JwtAuthGuard, UserService,]
})
export class UserModule {}
