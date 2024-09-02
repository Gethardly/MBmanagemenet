import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

@Schema()
export class Phone {
  @Prop({
    type: String,
    required: [true, 'Field phone is required'],
  })
  phone: string;

  @Prop({
    type: String,
    required: [true, 'Field bank is required'],
  })
  bank: string
}

export const PhoneSchema = SchemaFactory.createForClass(Phone);
export type PhoneDocument = Phone & Document<ObjectId>;