import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Withdraw } from '../../operation-requests/schema/withdraw.schema';

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

  @Prop({
    type: String,
    required: [true, 'role is required'],
    default: 'user',
    enum: ['user', 'admin'],
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document<ObjectId>;

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});
