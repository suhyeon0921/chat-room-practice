import { IsNotEmpty, IsString } from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions } from 'mongoose';

// user 스키마
const options: SchemaOptions = {
  id: false,
  collection: 'users',
  timestamps: true,
};

@Schema(options)
export class User extends Document {
  @Prop({
    unique: true,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  username: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
