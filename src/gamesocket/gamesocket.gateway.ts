import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { GamesocketService } from './gamesocket.service';
import { Server, Socket } from 'socket.io';
import { Bind, Injectable } from '@nestjs/common';


@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class GamesocketGateway {
  constructor(private readonly gamesocketService: GamesocketService) { }

  private userSocketMap = new Map<string, Socket>();

  @WebSocketServer() server: Server;

  afterInit(server: Socket) {
  }

  handleConnection(socket: Socket) {
    let userId = socket.handshake.query.userId;
    if (Array.isArray(userId)) {
      userId = userId[0]; // Use the first element of the array
    }
    if (typeof userId === 'string') {
      this.userSocketMap.set(userId, socket);
    }
    // const query = socket.handshake.query;
  }

  handleDisconnect(socket: Socket) {
    let userId = socket.handshake.query.userId;
    if (Array.isArray(userId)) {
      userId = userId[0];
    }
    if (typeof userId === 'string') {
      this.userSocketMap.delete(userId);
    }
  }

  broadcastEvent(event: string, payload: any) {
    this.server.emit(event, payload);
  }

  @Bind(MessageBody(), ConnectedSocket())
  @SubscribeMessage('gameStart')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    // console.log("Room joined -> ", client.rooms);
    // await client.join(data.roomId.toString());
    // client.emit('joinedRoom', `You have joined room ${data.roomId}`);
  }


  @Bind(MessageBody(), ConnectedSocket())
  @SubscribeMessage('gameEnd')
  async handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    // await client.leave(data.roomId.toString());
    // client.emit('leaveRoom', `You have joined room ${data.roomId}`);
  }



}
