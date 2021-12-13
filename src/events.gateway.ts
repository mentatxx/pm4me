import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PORT } from './environment/environment';

@WebSocketGateway(PORT, { namespace: 'events' })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  logUpdated(service: string, updatedAfter: string) {
    this.server.emit('updated', { service, updatedAfter });
  }
}
