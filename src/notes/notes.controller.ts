import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { NotesDto } from './dto/notes.dto';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  createNote(@Body() noteDto: NotesDto) {
    return this.notesService.saveNoteInDB(noteDto);
  }
}
