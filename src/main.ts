#!/usr/bin/env node

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HOSTNAME, PORT } from './environment/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, HOSTNAME);
}
bootstrap();
