import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { RenderService } from './render.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly render: RenderService,
  ) {}

  @Get()
  getDashboard(): string {
    const data = this.appService.dashboardData();
    return this.render.renderIndex(data);
  }

  @Get('service/:name')
  getService(@Param('name') name: string): string {
    const data = this.appService.serviceData(name);
    if (!data) {
      throw new BadRequestException('Invalid service name');
    }
    return this.render.renderService(data);
  }

  @Get('service/:name/partial')
  getServicePartial(
    @Param('name') name: string,
    @Query('updatedAfter') updAfter: string,
  ) {
    const updatedAfter = isNaN(+updAfter) ? 0 : +updAfter;
    const content = this.appService.getPartialOutput(name, updatedAfter);
    if (!content) {
      throw new BadRequestException('Invalid service name');
    }
    return { content };
  }
}
