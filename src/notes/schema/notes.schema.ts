import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Notes {
  @Prop({
    type: String,
    minlength: 1,
    maxlength: 255,
    required: [true, 'Field title is required.'],
  })
  title: string;

  @Prop({
    type: String,
    minlength: 1,
  })
  description: string;
}
