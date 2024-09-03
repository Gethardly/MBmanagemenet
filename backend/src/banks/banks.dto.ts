import { IsNotEmpty, IsString } from 'class-validator';

export class BanksDto {
  _id: string;

  @IsNotEmpty()
  @IsString()
  bank: string;
}