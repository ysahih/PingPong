import { Module } from '@nestjs/common';
import { GatewayModule } from './Gateway/gateway.module';
import { PrismaModule } from './PrismaService/prisma.module';

@Module({
  imports: [PrismaModule, GatewayModule],
})
export class AppModule {}
