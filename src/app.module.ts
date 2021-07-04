import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RenderService } from './render.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, RenderService],
})
export class AppModule {
  constructor(private app: AppService, private render: RenderService) {}

  async onModuleInit() {
    this.render.loadTemplates();
    await this.app.loadConfiguration();
  }
}
