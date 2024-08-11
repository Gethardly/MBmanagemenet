import { IsDateString, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class WithdrawDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  recipient_name: string;

  @IsNotEmpty()
  @IsDateString()
  withdrawal_request_date: Date;

  @IsNotEmpty()
  @IsString()
  amount: number;

  @IsNotEmpty()
  @IsString()
  phone_number: string;
}