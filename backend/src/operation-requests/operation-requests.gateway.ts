import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { RechargeRequestDto } from './dto/rechargeRequestDto';

@WebSocketGateway()
export class OperationRequestsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('OperationRequestsGateway');

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    try {
      //const payload = jwt.verify(token, 'your-secret-key');
      this.logger.log(`Client connected: ${client.id}`);
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
    //this.logger.log(`Message received: ${payload.message} from ${payload.sender}`);
    this.logger.log('message', payload);
    this.server.emit('message', payload);
  }

  public sendToAll(payload: RechargeRequestDto): void {
    this.logger.log(`Sending message to all clients`);
    this.server.emit('message', payload);
  }
}
