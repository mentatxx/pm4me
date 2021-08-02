import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

export interface ProcessConfiguration {
  name: string;
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
    this.startProcess();
  }

  startProcess() {
    this.output += `<span class="info">App start ${escapeHTML(
      this.config.name,
    )}</span><br/>`;

    this.handle = spawn(this.config.script, this.config.args || [], {
      shell: true,
      cwd: this.config.cwd,
    });

    this.handle.stdout.on('data', (data: Buffer) => {
      this.output += `<span class="log">${escapeHTML(data.toString())}</span>`;
      console.log(data.toString());
    });

    this.handle.stderr.on('data', (data: Buffer) => {
      this.output += `<span class="error">${escapeHTML(
        data.toString(),
      )}</span>`;
      console.error(`ERR: ${data.toString()}`);
    });

    this.handle.on('close', (code) => {
      console.error(`child process exited with code ${code}`);
      setTimeout(() => {
        this.startProcess();
      }, this.config.restartAfter);
    });
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
