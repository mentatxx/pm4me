import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import EventEmitter from 'events';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Convert = require('ansi-to-html');
const convert = new Convert();
export interface ProcessConfiguration {
  name: string;
  preStart: string;
  script: string;
  args?: string[];
  cwd?: string;
  restartAfter: number;
}

const escapeHTML = (str: string) =>
  (str || '').replace(
    /[&<>'"\n]/g,
    (tag) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
        '\n': '<br/>',
      }[tag]),
  );
export class Process {
  output = '';
  handle: ChildProcessWithoutNullStreams;
  events = new EventEmitter();

  constructor(private config: ProcessConfiguration) {
    this.preStartProcess();
    if (!this.handle) {
      this.startProcess();
    }
  }

  private applyBindings() {
    const logHandler =
      (htmlClass: string, consoleHandler: 'log' | 'error') =>
      (data: Buffer) => {
        const plainText = data.toString();
        const outputLength = this.output.length;
        this.output += `<span class="${htmlClass}">${convert.toHtml(
          escapeHTML(plainText),
        )}</span>`;
        console[consoleHandler](plainText);
        this.events.emit('data', String(outputLength));
      };
    this.handle.stdout.on('data', logHandler('log', 'log'));
    this.handle.stderr.on('data', logHandler('error', 'error'));

    this.handle.on('close', (code) => {
      console.error(`child process exited with code ${code}`);
      this.handle = null;
      setTimeout(() => {
        this.startProcess();
      }, this.config.restartAfter);
    });
  }

  preStartProcess() {
    if (this.config.preStart) {
      this.output += `<span class="info">Pre start ${escapeHTML(
        this.config.name,
      )} - ${escapeHTML(this.config.preStart)}</span><br/>`;

      this.handle = spawn(this.config.preStart, [], {
        shell: true,
        cwd: this.config.cwd,
      });
      this.applyBindings();
    }
  }

  startProcess() {
    this.output += `<span class="info">App start ${escapeHTML(
      this.config.name,
    )}</span><br/>`;

    if (this.config.script) {
      this.handle = spawn(
        'cmd.exe',
        ['/c', this.config.script, ...this.config.args],
        {
          shell: true,
          cwd: this.config.cwd,
        },
      );

      this.applyBindings();
    }
  }

  killProcess() {
    if (this.handle) {
      const handle = this.handle;
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', handle.pid + '', '/f', '/t']);
      } else {
        handle.kill('SIGTERM');
        setTimeout(() => {
          handle.kill('SIGKILL');
        }, 10000);
      }
    }
  }
}
