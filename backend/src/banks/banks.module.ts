import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Banks, BanksSchema } from './banks.schema';
import { BanksController } from './banks.controller';
import { BanksService } from './banks.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Banks.name,
        schema: BanksSchema,
      },
    ]),
  ],
  controllers: [BanksController],
  providers: [BanksService]
})
export class BanksModule {}