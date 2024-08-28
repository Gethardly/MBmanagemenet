import { IsNotEmpty, IsString } from 'class-validator';
import { BankPhonesEnum } from '../../types';

export class PhoneDto {
  id: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  bank: BankPhonesEnum;
}