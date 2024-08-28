import { Module } from '@nestjs/common';
import { PhoneController } from './phone.controller';
import { PhoneService } from './phone.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Phone, PhoneSchema } from './phone.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Phone.name,
        schema: PhoneSchema,
      },
    ]),
  ],
  controllers: [PhoneController],
  providers: [PhoneService]
})
export class PhoneModule {}
