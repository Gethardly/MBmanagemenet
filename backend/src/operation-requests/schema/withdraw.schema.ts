import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

@Schema({ timestamps: true })
export class Withdraw {
  @Prop({
    type: String,
    minlength: 1,
    maxlength: 150,
    required: [true, 'Field recipient_name is required.'],
  })
  recipient_name: string;

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
  withdrawal_request_date: string;

  @Prop({
    type: String,
    minlength: 1,
    maxlength: 50,
    required: [true, 'Field amount is required.'],
  })
  amount: string;

  @Prop({
    type: String,
    minlength: 1,
    required: [true, 'Field phone_number is required.'],
  })
  phone_number: string;

  @Prop({
    type: Boolean || null,
    default: null,
  })
  status: boolean
}

export const WithdrawSchema = SchemaFactory.createForClass(Withdraw);
export type WithdrawDocument = Withdraw & Document<ObjectId>;