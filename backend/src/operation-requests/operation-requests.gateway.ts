import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { RechargeRequestDto } from './dto/rechargeRequestDto';

@WebSocketGateway()
export class OperationRequestsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('OperationRequestsGateway');

  constructor(
    private readonly jwtStrategy: JwtStrategy,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.auth as string;

    try {
      const payload = await this.jwtStrategy.validate(token);
      const { _id } = payload;
      if (!_id) {
        this.logger.error(`Invalid token`);
        client.disconnect();
      } else {
        this.logger.log(`Client connected: ${client.id}`);
      }
    } catch (err) {
      this.logger.error(`Client connection error: ${err.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { sender: string; message: string }): void {
    this.logger.log('message', payload);
    this.server.emit('message', payload);
  }

  public sendToAll(payload: RechargeRequestDto): void {
    this.logger.log(`Sending message to all clients`);
    this.server.emit('message', payload);
  }
}
