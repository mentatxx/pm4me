import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule } from './env/env.module';
import { RenderService } from './render.service';

@Module({
  imports: [EnvModule],
  controllers: [AppController],
  providers: [AppService, RenderService],
})
export class AppModule {
  constructor(private app: AppService, private render: RenderService) {}

  async onModuleInit() {
    this.render.loadTemplates();
    await this.app.loadConfiguration();
  }

  async onApplicationShutdown() {
    await this.app.shutdownProcesses();
  }
}
