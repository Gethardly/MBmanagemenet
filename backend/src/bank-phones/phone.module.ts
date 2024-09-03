import { Module, OnModuleInit } from '@nestjs/common';
import { PhoneController } from './phone.controller';
import { PhoneService } from './phone.service';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { Phone, PhoneSchema } from './phone.schema';
import { AuthModule } from '../auth/auth.module';
import { Banks, BanksSchema } from '../banks/banks.schema';
import { Model } from 'mongoose';
import { Bank } from '../types';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Phone.name,
        schema: PhoneSchema,
      },
      {
        name: Banks.name,
        schema: BanksSchema,
      }
    ]),
  ],
  controllers: [PhoneController],
  providers: [PhoneService]
})
export class PhoneModule {}