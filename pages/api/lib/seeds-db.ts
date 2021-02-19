import { Seed } from './../../../models/seeds/seed.model';
import { SeedStatistics } from './../../../models/seeds/seed-statistics.model';
import { SeedAsset } from './../../../models/seeds/seed-asset.model';
import {
  createConnection as typeOrmCreateConnection,
  Connection,
  ConnectionOptions,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
// TODO: May need to be moved in future if we get more than one db
import 'reflect-metadata';

let databaseConnection: Connection;

const config: ConnectionOptions = {
  type: 'mysql',
  host: String(process.env.SEEDS_DB_HOST ?? '127.0.0.1'),
  port: Number(process.env.SEEDS_DB_PORT ?? 3306),
  username: String(process.env.SEEDS_DB_USERNAME),
  password: String(process.env.SEEDS_DB_PASSWORD),
  database: String(process.env.SEEDS_DB_NAME),
  synchronize: Boolean(process.env.SEEDS_DB_SYNCHRONIZE ?? false),
  // TODO: Load via file
  entities: [Seed, SeedAsset, SeedStatistics],
  name: uuid(),
};

export const createConnection = async (): Promise<Connection> => {
  if (databaseConnection && databaseConnection.isConnected) {
    return databaseConnection;
  }

  try {
    databaseConnection = await typeOrmCreateConnection(config);
  } catch (e) {
    console.error('Could not create a connection with the database, check settings!', e);
    throw e;
  }

  if (!databaseConnection) {
    throw new Error('Database connection still does not exist!');
  }

  return databaseConnection;
};