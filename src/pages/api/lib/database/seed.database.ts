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
import { AuthUser, Seed, SeedAsset, SeedStatistic } from '../../../../models';
import { SeedOverview } from '../../../../models/seeds/seed-overview.model';
import { SeedTag } from '../../../../models/seeds/seed-tag.models';

export class SeedDatabase {
  private static _instance: SeedDatabase;

  private readonly DB_CONNECTION_NAME = 'seeds';
  private readonly DB_CONNECT_DELAY_MS = Number(process.env.SEEDS_DB_CONNECT_DELAY_MS ?? 100);
  private readonly config: ConnectionOptions;

  private isConnecting: boolean;
  private dbConnection: Connection;

  public constructor() {
    this.config = {
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
      name: this.DB_CONNECTION_NAME,
    };
  }

  public static get instance(): SeedDatabase {
    if (!SeedDatabase._instance) {
      SeedDatabase._instance = new SeedDatabase();
    }
    return SeedDatabase._instance;
  }

  private entitiesChanged(previous: unknown[], entities: unknown[]): boolean {
    if (previous.length !== entities.length) return true;

    for (let i = 0; i < previous.length; i++) {
      if (previous[i] !== entities[i]) return true;
    }

    return false;
  }

  private async updateConnectionEntities(entities: unknown[]) {
    if (!this.entitiesChanged(this.dbConnection.options.entities, entities)) return;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.dbConnection.options.entities = entities;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.dbConnection.buildMetadatas();

    if (this.dbConnection.options.synchronize) {
      await this.dbConnection.synchronize();
    }
  }

  private async createConnection(): Promise<Connection> {
    if (this.dbConnection) {
      if (!this.dbConnection.isConnected) {
        await this.dbConnection.connect();
      }
      console.log('Re-using existing connection', DateTime.now().toISO());
      return this.dbConnection;
    }

    if (this.isConnecting) {
      console.log(`Already connecting to database, waiting ${this.DB_CONNECT_DELAY_MS}ms`);
      await delay(this.DB_CONNECT_DELAY_MS);
      return this.createConnection();
    }

    this.isConnecting = true;

    try {
      const manager = getConnectionManager();

      if (manager.has(this.DB_CONNECTION_NAME)) {
        console.log(
          `Found existing connection for '${this.DB_CONNECTION_NAME}', in TypeORM Connection manager`,
        );
        this.dbConnection = manager.get(this.DB_CONNECTION_NAME);

        if (!this.dbConnection.isConnected) {
          await this.dbConnection.connect();
        }

        if (process.env.SEEDS_DISABLE_ENTITY_CONNECTION_POPULATION !== 'true') {
          console.log('Updating existing connection with entities');
          await this.updateConnectionEntities(this.config.entities);
        }
      } else {
        this.dbConnection = await typeOrmCreateConnection(this.config);
        console.log('Got connection', DateTime.now().toISO());
      }

      this.isConnecting = false;
    } catch (e) {
      this.isConnecting = false;
      console.error('Could not create a connection with the database, check settings!', e);
      throw e;
    }

    if (!this.dbConnection) {
      throw new Error('Database connection still does not exist!');
    }

    return this.dbConnection;
  }

  public get connection(): Promise<Connection> {
    return this.createConnection();
  }

  public async getRepo<T extends unknown = Seed>(type: EntityTarget<T>): Promise<Repository<T>> {
    const connection = await this.connection;
    return connection.getRepository(type);
  }
}
