import { Body, Controller, Post } from '@nestjs/common';
import { OperationRequestsGateway } from './operation-requests.gateway';

@Controller('operation-requests')
export class OperationRequestsController {
  constructor(private readonly operationRequestsGateway: OperationRequestsGateway) {}

  @Post()
  sendMessage(@Body() body: { sender: string; message: string }): string {
    this.operationRequestsGateway.sendToAll(body);
    return `Message sent to all clients: ${body.message} from ${body.sender}`;
  }
}
