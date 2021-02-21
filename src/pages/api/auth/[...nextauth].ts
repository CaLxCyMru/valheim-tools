import { DateTime } from 'luxon';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { InitOptions } from 'next-auth';
import Adapters from 'next-auth/adapters';
import Providers from 'next-auth/providers';
import { Role } from '../../../enums';
import { AuthUser } from '../../../models/auth-user/auth-user.model';
import { Session } from '../../../types';
import { createConnection } from '../lib/seeds-db';

const options: InitOptions = {
  // full list of providers can be found https://next-auth.js.org/configuration/providers
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Providers.Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    Providers.Twitch({
      clientId: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
    }),
  ],
  adapter: Adapters.TypeORM.Adapter({
    type: 'mysql',
    host: String(process.env.AUTH_DB_HOST ?? '127.0.0.1'),
    port: Number(process.env.AUTH_DB_PORT ?? 3306),
    username: String(process.env.AUTH_DB_USERNAME),
    password: String(process.env.AUTH_DB_PASSWORD),
    database: String(process.env.AUTH_DB_NAME),
    synchronize: Boolean(process.env.AUTH_DB_SYNCHRONIZE ?? false),
  }),
  events: {
    signIn: async ({ user: { id, name } }) => {
      const connection = await createConnection();
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
    },
  },
  callbacks: {
    session: async (sessionData, { id }: { [key: string]: string | number }) => {
      if (!id) {
        throw new Error('Error whilst getting session - no id present');
      }
      const session = sessionData as Session;

      session.user.id = id;

      try {
        const connection = await createConnection();
        const repo = connection.getRepository(AuthUser);
        session.user.role = (await repo.findByIds([id]))[0].role;
      } catch (error) {
        session.user.role = Role.USER;
      }

      return session;
    },
  },
};

export default (req: NextApiRequest, res: NextApiResponse): unknown => NextAuth(req, res, options);
