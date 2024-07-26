import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RechargeRequestDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  sender_name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  payment_date: string;

  @IsNotEmpty()
  @IsString()
  amount: number;
}