import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

@Schema({ timestamps: true })
export class Recharge {
  @Prop({
    type: String,
    minlength: 1,
    maxlength: 150,
    required: [true, 'Field title is required.'],
  })
  sender_name: string;

  @Prop({
    type: Date,
    required: [true, 'Field title is required.'],
    validate: {
      validator: function (value: Date) {
        return (
          value.getHours() !== 0 ||
          value.getMinutes() !== 0 ||
          value.getSeconds() !== 0
        );
      },
      message: 'Invalid datetime',
    },
  })
  payment_date: string;

  @Prop({
    type: String,
    minlength: 1,
    maxlength: 50,
    required: [true, 'Field title is required.'],
  })
  amount: string;

  @Prop({
    type: String,
    minlength: 1,
    required: [true, 'Field title is required.'],
  })
  filename: string;

  @Prop({
    type: Boolean || null,
    default: null,
  })
  status: boolean
}

export const RechargeSchema = SchemaFactory.createForClass(Recharge);
export type RechargeDocument = Recharge & Document<ObjectId>;