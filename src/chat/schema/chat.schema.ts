import { IsNotEmpty, IsString } from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions, Types } from 'mongoose';
import { User as SocketModel } from './user.schema';

const options: SchemaOptions = {
  collection: 'chat',
  timestamps: true,
};

@Schema(options)
export class Chat extends Document {
  @Prop({
    type: {
      _id: { type: Types.ObjectId, required: true, ref: 'users' },
      id: { type: String },
      username: { type: String, required: true },
    },
  })
  @IsNotEmpty()
  user: SocketModel;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  chat: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
