import { Module } from '@nestjs/common';
import { OperationRequestsGateway } from './operation-requests.gateway';
import { OperationRequestsController } from './operation-requests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Recharge, RechargeSchema } from './schema/recharge.schema';
import { RechargeService } from './services/recharge.service';
import { WithdrawService } from './services/withdraw.service';
import { Withdraw, WithdrawSchema } from './schema/withdraw.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Recharge.name,
        schema: RechargeSchema,
      },
      {
        name: Withdraw.name,
        schema: WithdrawSchema,
      }
    ]),
  ],
  providers: [OperationRequestsGateway, RechargeService, WithdrawService],
  controllers: [OperationRequestsController],
})
export class OperationRequestsModule {}
