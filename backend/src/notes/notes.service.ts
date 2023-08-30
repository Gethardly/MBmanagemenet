import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Notes } from './schema/notes.schema';
import mongoose, { Model } from 'mongoose';
import { CreateNoteDto } from './dto/createNoteDto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Notes.name) private notesModel: Model<Notes>) {}

  async saveNoteInDB(notesDto: CreateNoteDto) {
    try {
      return await this.notesModel.create(notesDto);
    } catch (e) {
      throw e;
    }
  }

  async getNotesFromDB() {
    try {
      return await this.notesModel.find();
    } catch (e) {
      throw e;
    }
  }

  async getOneNoteFromDB(id: string) {
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw new UnprocessableEntityException('Invalid note id');
      }
      const note = await this.notesModel.findOne({ _id: id });
      if (!note) {
        throw new UnprocessableEntityException('Invalid note id');
      }
      return note;
    } catch (e) {
      throw e;
    }
  }

  async changeOneNote(id: string, newNote: CreateNoteDto) {
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw new UnprocessableEntityException('Invalid note id');
      }
      const editedNote = await this.notesModel.updateOne({ _id: id }, newNote);
      if (editedNote.modifiedCount === 0 || editedNote.matchedCount === 0) {
        throw new UnprocessableEntityException('Invalid note id');
      }
      return editedNote;
    } catch (e) {
      throw e;
    }
  }

  async deleteOneNote(id: string) {
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw new UnprocessableEntityException('Invalid note id');
      }
      const deletedNote = await this.notesModel.deleteOne({ _id: id });
      if (deletedNote.deletedCount === 0) {
        throw new UnprocessableEntityException('Invalid note id');
      }
      return deletedNote;
    } catch (e) {
      throw e;
    }
  }
}
