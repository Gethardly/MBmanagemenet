import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

@Schema()
export class Banks {
  @Prop({
    unique: true,
    type: String,
    required: [true, 'Field bank is required'],
  })
  bank: string;
}

export const BanksSchema = SchemaFactory.createForClass(Banks);
export type BanksDocument = Banks & Document<ObjectId>;