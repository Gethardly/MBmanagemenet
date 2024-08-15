import { Module } from '@nestjs/common';
import { MbankPhoneController } from './mbank-phone.controller';
import { MbankPhoneService } from './mbank-phone.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MbankPhone, MbankPhoneSchema } from './mbank-phone.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: MbankPhone.name,
        schema: MbankPhoneSchema,
      },
    ]),
  ],
  controllers: [MbankPhoneController],
  providers: [MbankPhoneService]
})
export class MbankPhoneModule {}
