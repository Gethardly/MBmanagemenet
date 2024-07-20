import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from './auth/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { NotesModule } from './notes/notes.module';
import { NotesController } from './notes/notes.controller';
import { NotesService } from './notes/notes.service';
import { Notes, NotesSchema } from './notes/schema/notes.schema';
import { OperationRequestsModule } from './operation-requests/operation-requests.module';
import { OperationRequestsController } from './operation-requests/operation-requests.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('DB_CONNECTION'),
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Notes.name, schema: NotesSchema },
    ]),
    AuthModule,
    NotesModule,
    OperationRequestsModule,
  ],
  controllers: [AppController, AuthController, NotesController],
  providers: [AppService, AuthService, JwtService, NotesService],
})
export class AppModule {}
