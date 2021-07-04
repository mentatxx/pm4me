import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import mustache from 'mustache';
import { resolve } from 'path';

@Injectable()
export class RenderService {
  indexTemplate: string = null;
  serviceTemplate: string = null;

  async loadTemplates() {
    this.indexTemplate = await this.loadTemplate(
      resolve(__dirname, '../templates/index.mustache'),
    );
    this.serviceTemplate = await this.loadTemplate(
      resolve(__dirname, '../templates/service.mustache'),
    );
  }

  private async loadTemplate(filename: string) {
    return (await readFile(filename)).toString();
  }

  renderIndex(data: any) {
    return mustache.render(this.indexTemplate, data);
  }

  renderService(data: any) {
    return mustache.render(this.serviceTemplate, data);
  }
}
