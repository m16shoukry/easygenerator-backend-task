import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User_Role } from '../interfaces/users.interface';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, match: /.+@.+\..+/ })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    enum: User_Role,
    default: User_Role.USER,
  })
  role: User_Role;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  is_verified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
