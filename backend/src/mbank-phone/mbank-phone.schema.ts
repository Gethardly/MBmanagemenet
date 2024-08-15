import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

@Schema()
export class MbankPhone {
  @Prop({
    type: String,
    required: [true, 'Field phone is required.'],
  })
  phone: string;
}

export const MbankPhoneSchema = SchemaFactory.createForClass(MbankPhone);
export type MbankDocument = MbankPhone & Document<ObjectId>;