import { Module } from '@nestjs/common';
import { ArgumentsService } from './arguments.service';
@Module({
  providers: [ArgumentsService],
  exports: [ArgumentsService],
})
export class ArgumentsModule {
  constructor(private args: ArgumentsService) {}

  async onModuleInit() {
    this.args.setup();
  }
}
