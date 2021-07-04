import { spawn } from 'child_process';
const RESTART_AFTER = 3000;

export interface ProcessConfiguration {
  name: string;
  script: string;
  args?: string[];
}

const escapeHTML = (str) =>
  str.replace(
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

  constructor(private config: ProcessConfiguration) {
    this.startProcess();
  }
  startProcess() {
    this.output = `<span class="info">App start ${escapeHTML(
      this.config.name,
    )}</span><br/>`;

    const p = spawn(this.config.script, this.config.args || [], {
      shell: true,
    });

    p.stdout.on('data', (data) => {
      this.output += `<span class="log">${escapeHTML(data)}</span>`;
      console.log(data);
    });

    p.stderr.on('data', (data) => {
      this.output += `<span class="error">${escapeHTML(data)}</span>`;
      console.error(`stderr: ${data}`);
    });

    p.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  }
}
