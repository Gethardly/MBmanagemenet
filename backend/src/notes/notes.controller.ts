import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { CreateNoteDto } from './dto/createNoteDto';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createNote(@Body() noteDto: CreateNoteDto) {
    return this.notesService.saveNoteInDB(noteDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getNotes() {
    return this.notesService.getNotesFromDB();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getOneNote(@Param('id') id: string) {
    return this.notesService.getOneNoteFromDB(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  editOneNote(@Param('id') id: string, @Body() newNote: CreateNoteDto) {
    return this.notesService.changeOneNote(id, newNote);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteOneNote(@Param('id') id: string) {
    return this.notesService.deleteOneNote(id);
  }
}
