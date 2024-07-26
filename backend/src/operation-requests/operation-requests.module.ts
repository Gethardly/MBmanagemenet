import { Module } from '@nestjs/common';
import { OperationRequestsGateway } from './operation-requests.gateway';
import { OperationRequestsController } from './operation-requests.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { Notes, NotesSchema } from '../notes/schema/notes.schema';
import { NotesService } from '../notes/notes.service';
import { NotesController } from '../notes/notes.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule, PassportStrategy } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { Recharge, RechargeSchema } from './schema/recharge.schema';
import { OperationRequestsService } from './operation-requests.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Recharge.name,
        schema: RechargeSchema,
      },
    ]),
  ],
  providers: [OperationRequestsGateway, OperationRequestsService],
  controllers: [OperationRequestsController],
})
export class OperationRequestsModule {}
