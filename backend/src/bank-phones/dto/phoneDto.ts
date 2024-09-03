import { IsNotEmpty, IsString } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export class PhoneDto {
  _id: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  bank: MongooseSchema.Types.ObjectId;
}