import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArgumentsModule } from './arguments/arguments.module';
import { EventsGateway } from './events.gateway';
import { RenderService } from './render.service';

@Module({
  imports: [ArgumentsModule],
  controllers: [AppController],
  providers: [AppService, RenderService, EventsGateway],
})
export class AppModule {
  constructor(private app: AppService, private render: RenderService) {}

  async onModuleInit() {
    await this.render.loadTemplates();
    await this.app.loadConfiguration();
  }

  async onApplicationShutdown() {
    await this.app.shutdownProcesses();
  }
}
