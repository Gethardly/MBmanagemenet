import { IsNotEmpty, IsString } from 'class-validator';

export class MbankPhoneDto {
  id: string;
  @IsNotEmpty()
  @IsString()
  phone: string;
}