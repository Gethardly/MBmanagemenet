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
export class PhoneModule implements OnModuleInit {
  constructor(
    @InjectModel(Banks.name) private readonly bankModel: Model<Banks>,
    @InjectModel(Phone.name) private readonly phoneModel: Model<Phone>,
  ) {}

  async onModuleInit() {
    const banks = await this.bankModel.find().exec();
    const bankNames = banks.map((bank) => bank.bank);

    PhoneSchema.path('bank').validate((value) => bankNames.includes(value), 'Invalid bank');
  }
}