import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { Process } from './process';

const CONFIG_NAME = './pm4pm.json';

@Injectable()
export class AppService {
  private config: any;
  private processes: Record<string, Process> = {};

  serviceData(name: string) {
    if (!this.processes[name]) {
      return null;
    }
    return this.processes[name];
  }

  async loadConfiguration() {
    try {
      this.config = JSON.parse((await readFile(CONFIG_NAME)).toString());
      this.validateConfiguration();
      this.config.services.forEach(
        (service: any) => (this.processes[service.name] = new Process(service)),
      );
    } catch (error) {
      console.error(
        `File not found or invalid ${CONFIG_NAME}, ${error.message}`,
      );
      process.exit(1);
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
    this.config.services.forEach((service: any) => {
      ['name', 'script'].forEach((key: string) => {
        if (typeof service[key] === 'undefined') {
          throw new Error(`Missing ${key} in ${JSON.stringify(service)}`);
        }
      });
      if (names.has(service.name)) {
        throw new Error(`Duplicate ${service.name}`);
      }
      names.add(service.name);
    });
  }

  dashboardData() {
    return this.processes;
  }
}
