import { Module } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/jwtStrategy/jwtguards';
import { prismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';
import { FriendsService } from './user.service';
import { cloudinaryService } from 'src/authentication/cloudinary.service';

@Module({
    controllers:[UserController],
    providers:[prismaService, JwtAuthGuard, FriendsService, cloudinaryService]
})
export class UserModule {}
