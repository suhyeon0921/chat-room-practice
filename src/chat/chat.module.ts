import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schema/chat.schema';
import { User as UserModel, UserSchema } from './schema/user.schema';
import { ChatGateway } from './gateway/chat.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: UserModel.name, schema: UserSchema },
    ]),
  ],
  providers: [ChatGateway],
})
export class ChatModule {}
