import { Global, Module } from '@nestjs/common';
import { prismaService } from './prisma.service';

@Global()
@Module({
    providers: [prismaService],
    exports: [prismaService],
})
export class PrismaModule {}
