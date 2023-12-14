import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { AbstractDocument } from 'src/common';
import { Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true, collection: 'user' })
export class UserDocument extends AbstractDocument {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: false })
  phoneNumber: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  @Exclude()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
