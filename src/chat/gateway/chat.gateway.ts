import { InjectModel } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Chat } from '../schema/chat.schema';
import { User as UserModel } from '../schema/user.schema';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');

  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    @InjectModel(UserModel.name)
    private readonly socketModel: Model<UserModel>,
  ) {
    this.logger.log('constructor');
  }

  afterInit() {
    this.logger.log('init');
  }

  /** 유저 연결 해제 */
  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const user = await this.socketModel.findOne({ id: socket.id });
    if (user) {
      socket.broadcast.emit('disconnect_user', user.username);
      await user.deleteOne({ id: socket.id });
    }
    this.logger.log(`disconnected : ${socket.id} ${socket.nsp.name}`);
  }

  /** 유저 연결 */
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`connected : ${socket.id} ${socket.nsp.name}`);
  }

  /** 새로운 유저 */
  @SubscribeMessage('new_user')
  async handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const exist = await this.socketModel.exists({ username });
    // 유저 이름, id 저장
    if (exist) {
      username = `${username}_${Math.floor(Math.random() * 100)}`;
      await this.socketModel.create({
        id: socket.id,
        username,
      });
    } else {
      await this.socketModel.create({
        id: socket.id,
        username,
      });
    }
    socket.broadcast.emit('user_connected', username);
    return username;
  }

  /** 채팅 메세지 전송 */
  @SubscribeMessage('submit_chat')
  async handleSubmitChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const socketObj = await this.socketModel.findOne({ id: socket.id });

    // 채팅 메세지 저장
    await this.chatModel.create({
      user: socketObj,
      chat: chat,
    });

    socket.broadcast.emit('new_chat', {
      chat,
      username: socketObj.username,
    });
  }
}
