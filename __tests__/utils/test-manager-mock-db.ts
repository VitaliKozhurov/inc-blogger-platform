import { Server } from 'http';

import express from 'express';
import { Db } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import superTestRequest, { Agent } from 'supertest';

import { runDB, stopDb } from '../../src/db';
import { initApp } from '../../src/init-app';

export class TestManagerMockDB {
  public request!: () => Agent;
  private mongoServer!: MongoMemoryServer;
  public DB!: Db;
  private server!: Server;

  async init() {
    const app = express();

    this.mongoServer = await MongoMemoryServer.create();

    this.request = () => superTestRequest(app);

    this.DB = await runDB(this.mongoServer.getUri());

    this.server = await initApp(app);

    return this;
  }

  async closeSession() {
    this.server.close();
    await stopDb();
  }

  async clearDB() {
    await this.DB.dropDatabase();
  }
}
