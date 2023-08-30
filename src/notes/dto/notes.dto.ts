import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class NotesDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  readonly title: string;

  @IsString()
  @MinLength(1)
  readonly description: string;
}
