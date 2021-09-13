import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { EnvService } from './env/env.service';
import { Process, ProcessConfiguration } from './process';

@Injectable()
export class AppService {
  private config: any;
  private processes: Record<string, Process> = {};

  constructor(private env: EnvService) {}

  serviceData(name: string) {
    if (!this.processes[name]) {
      return null;
    }
    return this.processes[name];
  }

  async loadConfiguration() {
    const configName = this.env.configName;
    try {
      this.config = JSON.parse((await readFile(configName)).toString());
      this.validateConfiguration();
      this.config.services.forEach((service: any) => {
        this.processes[service.name] = new Process(service);
      });
    } catch (error) {
      console.error(
        `File not found or invalid ${configName}, ${error.message}`,
      );
      process.exit(1);
    }
  }

  async shutdownProcesses() {
    for (const serviceName of Object.keys(this.processes)) {
      this.processes[serviceName].killProcess();
    }
  }

  private validateConfiguration() {
    if (
      !this.config ||
      !this.config.services ||
      !Array.isArray(this.config.services)
    ) {
      throw new Error('Missing services section');
    }
    const names = new Set<string>();
    this.config.services.forEach((service: ProcessConfiguration) => {
      ['name'].forEach((key: string) => {
        if (typeof service[key] === 'undefined') {
          throw new Error(`Missing ${key} in ${JSON.stringify(service)}`);
        }
      });
      if (names.has(service.name)) {
        throw new Error(`Duplicate ${service.name}`);
      }
      if (typeof service.restartAfter !== 'number') {
        service.restartAfter = this.env.restartAfter;
      }
      names.add(service.name);
    });
  }

  dashboardData() {
    return {
      processes: Object.values(this.processes),
    };
  }
}
