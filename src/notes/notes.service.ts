import { Injectable } from '@nestjs/common';
import { Notes } from './schema/notes.schema';
import { Model } from 'mongoose';
import { NotesDto } from './dto/notes.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Notes.name) private notesModel: Model<Notes>) {}

  async saveNoteInDB(notesDto: NotesDto) {
    try {
      return await this.notesModel.create(notesDto);
    } catch (e) {
      throw e;
    }
  }
}
