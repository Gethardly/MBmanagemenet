import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectId } from 'mongodb';

@Schema()
export class Phone extends Document {
  @Prop({
    type: String,
    required: [true, 'Field phone is required'],
  })
  phone: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Banks',
    required: true,
    validate: {
      validator: async function (value: ObjectId) {
        const bankExists = await this.model('Banks').findById(value);
        return !!bankExists;
      },
      message: 'Данный банк не существует!',
    },
  })
  bank: MongooseSchema.Types.ObjectId;
}

export const PhoneSchema = SchemaFactory.createForClass(Phone);
export type PhoneDocument = Phone & Document<ObjectId>;