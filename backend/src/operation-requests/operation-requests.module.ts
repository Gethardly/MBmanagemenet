import { Module } from '@nestjs/common';
import { OperationRequestsGateway } from './operation-requests.gateway';
import { OperationRequestsController } from './operation-requests.controller';

@Module({
  providers: [OperationRequestsGateway],
  controllers: [OperationRequestsController]
})
export class OperationRequestsModule {}
