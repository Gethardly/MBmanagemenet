import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

type role = 'admin' | 'operator';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({
    type: String,
    minlength: 5,
    maxlength: 255,
    required: [true, 'displayName field required'],
  })
  displayName: string;

  @Prop({
    unique: [true, 'Duplicate email entered'],
    required: [true, 'email field required'],
  })
  email: string;

  @Prop({
    required: [true, 'password field required'],
    minlength: 5,
    maxlength: 1024,
  })
  password: string;

  @Prop()
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});
