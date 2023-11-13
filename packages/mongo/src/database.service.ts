import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import delay from 'delay';
import mongoose from 'mongoose';
import {LoggerService} from '@monorepo-starter/logger';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly connections: { [key: string]: mongoose.Connection } = {};

  constructor() {}

  async onModuleInit() {
  }

  async onModuleDestroy() {
    await this.close();
  }

  async connect(url: string, logger: LoggerService): Promise<mongoose.Connection> {
    const key = url;

    if (this.connections[key]) {
      return this.connections[key];
    }

    logger.debug(`attempting to connect ${key}`);

    try {
      const connection = await mongoose.createConnection(key, {
      });
      this.connections[key] = connection;
      logger.info(`successfully connected ${key}`);
      return connection;
    } catch (e) {
      logger.error(`failed to connect '${e}'`);
      await delay(2500);
      return this.connect(url, logger);
    }
  }

  async close(url?: string): Promise<void> {
    if (url) {
      await this.connections[url].close();
      delete this.connections[url];
      return;
    }

    for (const key in this.connections) {
      if (this.connections.hasOwnProperty(key)) {
        console.log(`closing connection ${key}`);
        await this.connections[key].close();
        delete this.connections[key];
      }
    }
  }

  async dropCollection(collection: string, url: string) {
    const key = url;

    const conn = this.connections[key];
    try {
      return await conn.dropCollection(collection);
    } catch (e) {
      return;
    }
  }
}
