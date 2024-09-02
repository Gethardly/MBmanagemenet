import { IsNotEmpty, IsString } from 'class-validator';

export class BanksDto {
  id: string;

  @IsNotEmpty()
  @IsString()
  bank: string;
}