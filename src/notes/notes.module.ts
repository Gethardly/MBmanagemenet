import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notes, NotesSchema } from './schema/notes.schema';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Notes.name,
        schema: NotesSchema,
      },
    ]),
  ],
  providers: [NotesService, JwtService, JwtStrategy],
  controllers: [NotesController],
})
export class NotesModule {}
