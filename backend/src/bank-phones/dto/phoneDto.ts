import { IsNotEmpty, IsString } from 'class-validator';

export class PhoneDto {
  id: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  bank: string;
}