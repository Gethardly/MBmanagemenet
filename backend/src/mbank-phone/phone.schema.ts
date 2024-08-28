import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { BankPhonesEnum } from '../types';

@Schema()
export class Phone {
  @Prop({
    type: String,
    required: [true, 'Field phone is required'],
    enum: ['MBANK', 'OPTIMA', 'RSK']
  })
  phone: BankPhonesEnum;
}

export const PhoneSchema = SchemaFactory.createForClass(Phone);
export type BankDocument = Phone & Document<ObjectId>;