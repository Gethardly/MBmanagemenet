import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
    type: String,
    minlength: 1,
    maxlength: 50,
    required: [true, 'Field title is required.'],
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
}

export const RechargeSchema = SchemaFactory.createForClass(Recharge);
