import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
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

  constructor(private config: ProcessConfiguration) {
    this.preStartProcess();
    if (!this.handle) {
      this.startProcess();
    }
  }

  private applyBindings() {
    this.handle.stdout.on('data', (data: Buffer) => {
      this.output += `<span class="log">${convert.toHtml(
        escapeHTML(data.toString()),
      )}</span>`;
      console.log(data.toString());
    });

    this.handle.stderr.on('data', (data: Buffer) => {
      this.output += `<span class="error">${convert.toHtml(
        escapeHTML(data.toString()),
      )}</span>`;
      console.error(`ERR: ${data.toString()}`);
    });

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
      this.handle = spawn(this.config.script, this.config.args || [], {
        shell: true,
        cwd: this.config.cwd,
      });

      this.applyBindings();
    }
  }

  killProcess() {
    if (this.handle) {
      this.handle.kill('SIGTERM');
      setTimeout(() => {
        this.handle.kill('SIGKILL');
      }, 10000);
    }
  }
}
