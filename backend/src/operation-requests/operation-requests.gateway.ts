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
import { RechargeDocument } from './schema/recharge.schema';
import { OperationRequestsService } from './operation-requests.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://example.com'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class OperationRequestsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('OperationRequestsGateway');

  constructor(
    private readonly jwtStrategy: JwtStrategy,
    private operationRequestsService: OperationRequestsService,
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

  @SubscribeMessage('change-payment-status')
  handleMessage(client: Socket, payload: { id: string; status: boolean }) {
    this.server.emit('changed-payment-status', payload)
    return this.operationRequestsService.changeOne(payload.id, payload)
  }

  public sendToAll(payload: RechargeDocument): void {
    this.logger.log(`Sending message to all clients`);
    this.server.emit('payment', payload);
  }
}
