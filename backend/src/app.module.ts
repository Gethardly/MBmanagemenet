import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { StaticFilesController } from './static-files/static-files.controller';
import { MethodFilterMiddleware } from './middlewares/MethodFilterMiddleware';
import { MbankPhoneModule } from './mbank-phone/mbank-phone.module';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
    }),
    AuthModule,
    NotesModule,
    OperationRequestsModule,
    MbankPhoneModule,
  ],
  controllers: [AuthController, NotesController, StaticFilesController],
  providers: [AuthService, JwtService, NotesService,],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MethodFilterMiddleware)
      .forRoutes('*');
  }
}
