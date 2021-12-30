#!/usr/bin/env node

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HOSTNAME, PORT } from './environment/environment';
import { version } from '../package.json';

async function bootstrap() {
  console.log(`PM4ME ${version}`);
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, HOSTNAME);
  console.log(`Listening on http://localhost:${PORT}`);
}
bootstrap();
