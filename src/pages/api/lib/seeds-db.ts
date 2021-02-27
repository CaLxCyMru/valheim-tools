import delay from 'delay';
import { DateTime } from 'luxon';
import 'reflect-metadata';
import {
  Connection,
  ConnectionOptions,
  createConnection as typeOrmCreateConnection,
  EntityTarget,
  getConnectionManager,
  Repository,
} from 'typeorm';
import { AuthUser, Seed, SeedAsset, SeedStatistic } from '../../../models';
import { SeedOverview } from '../../../models/seeds/seed-overview.model';
import { SeedTag } from '../../../models/seeds/seed-tag.models';

let databaseConnection: Connection;

const DB_CONNECTION_NAME = 'seeds';
const DB_CONNECT_DELAY_MS = Number(process.env.SEEDS_DB_CONNECT_DELAY_MS ?? 100);

const config: ConnectionOptions = {
  type: 'mysql',
  host: String(process.env.SEEDS_DB_HOST ?? '127.0.0.1'),
  port: Number(process.env.SEEDS_DB_PORT ?? 3306),
  username: String(process.env.SEEDS_DB_USERNAME),
  password: String(process.env.SEEDS_DB_PASSWORD),
  database: String(process.env.SEEDS_DB_NAME),
  synchronize: Boolean(process.env.SEEDS_DB_SYNCHRONIZE ?? false),
  cache: {
    alwaysEnabled: Boolean(process.env.SEEDS_DB_CACHE_ALWAYS_ENABPLED ?? false),
    duration: Number(process.env.SEEDS_DB_GLOBAL_CACHE_DURATION ?? 1000),
  },
  // TODO: Load via file
  entities: [Seed, SeedAsset, SeedStatistic, SeedOverview, AuthUser, SeedTag],
  name: DB_CONNECTION_NAME,
};

let isConnecting: boolean;

const entitiesChanged = (prevEntities: unknown[], newEntities: unknown[]): boolean => {
  if (prevEntities.length !== newEntities.length) return true;

  for (let i = 0; i < prevEntities.length; i++) {
    if (prevEntities[i] !== newEntities[i]) return true;
  }

  return false;
};

const updateConnectionEntities = async (connection: Connection, entities: unknown[]) => {
  if (!entitiesChanged(connection.options.entities, entities)) return;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  connection.options.entities = entities;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  connection.buildMetadatas();

  if (connection.options.synchronize) {
    await connection.synchronize();
  }
};

export const createConnection = async (): Promise<Connection> => {
  if (databaseConnection) {
    if (!databaseConnection.isConnected) {
      await databaseConnection.connect();
    }
    console.log('Re-using existing connection', DateTime.now().toISO());
    return databaseConnection;
  }

  if (isConnecting) {
    console.log(`Already connecting to database, waiting ${DB_CONNECT_DELAY_MS}ms`);
    await delay(DB_CONNECT_DELAY_MS);
    return createConnection();
  }

  isConnecting = true;

  try {
    const manager = getConnectionManager();

    if (manager.has(DB_CONNECTION_NAME)) {
      console.log(
        `Found existing conenction for '${DB_CONNECTION_NAME}', in TypeORM Connection manager`,
      );
      databaseConnection = manager.get(DB_CONNECTION_NAME);

      if (!databaseConnection.isConnected) {
        await databaseConnection.connect();
      }

      if (process.env.SEEDS_DISABLE_ENTITY_CONNECTION_POPULATION !== 'true') {
        console.log('Updating existing connection with entities');
        await updateConnectionEntities(databaseConnection, config.entities);
      }
    } else {
      databaseConnection = await typeOrmCreateConnection(config);
      console.log('Got connection', DateTime.now().toISO());
    }

    isConnecting = false;
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

export const getRepo = async <T extends unknown = Seed>(
  type: EntityTarget<T> = Seed,
): Promise<Repository<T>> => {
  const connection = await createConnection();
  const repo = connection.getRepository(type);
  return repo;
};
