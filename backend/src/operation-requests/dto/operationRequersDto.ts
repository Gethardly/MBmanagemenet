import { IsBoolean, IsDate, IsDateString, IsEmpty, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RechargeRequestsDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  sender_name: string;

  @IsNotEmpty()
  @IsDateString()
  payment_date: Date;

  @IsNotEmpty()
  @IsString()
  amount: number;
}

export class GetRechargeDto {
  @IsString()
  start_date: string;
  @IsString()
  end_date: string;
/*  @IsString()
  status: boolean;
  @IsString()
  sender_name: string;*/
}

export class ChangeRechargeDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsBoolean()
  status: boolean
}