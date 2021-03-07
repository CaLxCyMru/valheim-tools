import { DateTime } from 'luxon';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { FindOneOptions, ObjectID } from 'typeorm';
import { ApiError, Role } from '../../../../enums';
import { AuthUser } from '../../../../models';
import { Session } from '../../../../types';
import { error } from '../../../../utils';
import { SeedDatabase } from '../database/seed.database';

export class AuthService {
  private static _instance: AuthService;
  public constructor(private readonly database: SeedDatabase) {}

  public static get instance(): AuthService {
    if (!AuthService._instance) {
      AuthService._instance = new AuthService(SeedDatabase.instance);
    }
    return AuthService._instance;
  }

  public async save({ id, name }: { id: number; name: string }): Promise<void> {
    const connection = await this.database.connection;
    const now = DateTime.now().toJSDate();

    const user: AuthUser = {
      id,
      name,
      created: now,
      updated: now,
      role: Role.USER,
    };

    await connection
      .createQueryBuilder()
      .insert()
      .into(AuthUser)
      .values(user)
      .orUpdate({ conflict_target: ['id'], overwrite: ['updated'] })
      .execute();
  }

  public async find(
    id: string | number | Date | ObjectID,
    options?: FindOneOptions<AuthUser>,
  ): Promise<AuthUser | undefined> {
    try {
      const repo = await this.database.getRepo<AuthUser>(AuthUser);
      return await repo.findOne(id, options);
    } catch (ex) {
      console.error(`Error whilst fetching auth user: ${ex}`);
      return undefined;
    }
  }

  public async verifySession(req: NextApiRequest, res: NextApiResponse): Promise<Session | never> {
    const session = (await getSession({ req })) as Session;

    if (!session) {
      error(res, 'Unauthorized', ApiError.UNAUTHORIZED, undefined, 403);
      return;
    }

    return session;
  }
}
