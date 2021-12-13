import { Injectable } from '@nestjs/common';
import { program } from 'commander';

const DEFAULT_RESTART_AFTER = 3000;

@Injectable()
export class ArgumentsService {
  options = null;

  setup() {
    program
      .version('0.0.1')
      .option(
        '-c, --config <filename>',
        'Configration filename',
        './pm4me.json',
      )
      .option(
        '-t, --timeout <timeout>',
        'Restart after (ms). On succesful exit, restart after this period (in ms)',
        DEFAULT_RESTART_AFTER + '',
      );
    program.parse(process.argv);
    this.options = program.opts();
  }

  get configName(): string {
    return this.options.config;
  }

  get restartAfter(): number {
    if (isNaN(this.options.timeout)) {
      return DEFAULT_RESTART_AFTER;
    } else {
      return +this.options.timeout;
    }
  }
}
