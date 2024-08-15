import { Module } from '@nestjs/common';
import { MbankPhoneController } from './mbank-phone.controller';

@Module({
  controllers: [MbankPhoneController]
})
export class MbankPhoneModule {}
