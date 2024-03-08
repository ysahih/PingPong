import { Module } from '@nestjs/common';
import { GatewayModule } from '../../src/Gateway/gateway.module';
import { PrismaModule } from './PrismaService/prisma.module';

@Module({
  imports: [PrismaModule, GatewayModule],
})
export class AppModule { }
