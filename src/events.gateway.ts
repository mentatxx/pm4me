import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  logUpdated(service: string, updatedAfter: string) {
    this.server.emit('updated', { service, updatedAfter });
  }
}
