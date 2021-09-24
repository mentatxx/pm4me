import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
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

  @Post('service/:name')
  updateService(
    @Param('name') name: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const data = this.appService.serviceData(name);
    if (!data) {
      throw new BadRequestException('Invalid service name');
    }
    if (body.kill) {
      this.appService.kill(name);
    }
    res.redirect('/');
  }
}
