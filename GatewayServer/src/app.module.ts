import { Module } from '@nestjs/common';
import { GatewayModule } from './Gateway/gateway.module';

@Module({
  imports: [GatewayModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
