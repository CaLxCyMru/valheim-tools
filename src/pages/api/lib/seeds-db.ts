import { DateTime } from 'luxon';
import {
  createConnection as typeOrmCreateConnection,
  Connection,
  ConnectionOptions,
  Repository,
  EntityTarget,
} from 'typeorm';
import 'reflect-metadata';
import { v4 as uuid } from 'uuid';
import { Seed, SeedStatistic, SeedAsset, AuthUser } from '../../../models';

import delay from 'delay';
import { SeedOverview } from '../../../models/seeds/seed-overview.model';

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
  entities: [Seed, SeedAsset, SeedStatistic, SeedOverview, AuthUser],
  name: uuid(),
};

let isConnecting: boolean;

export const createConnection = async (): Promise<Connection> => {
  if (databaseConnection && databaseConnection.isConnected) {
    console.log('Re-using existing connection', DateTime.now().toISO());
    return databaseConnection;
  }

  if (isConnecting) {
    console.log('Already connecting to database, waiting 1000ms');
    await delay(1000);
    return await createConnection();
  }

  try {
    isConnecting = true;
    databaseConnection = await typeOrmCreateConnection(config);
    isConnecting = false;
    console.log('Got connection', DateTime.now().toISO());
  } catch (e) {
    isConnecting = false;
    console.error('Could not create a connection with the database, check settings!', e);
    throw e;
  }

  if (!databaseConnection) {
    throw new Error('Database connection still does not exist!');
  }

  return databaseConnection;
};

export const getRepo = async <T extends any = Seed>(
  type: EntityTarget<T> = Seed,
): Promise<Repository<T>> => {
  const connection = await createConnection();
  const repo = connection.getRepository(type);
  return repo;
};
