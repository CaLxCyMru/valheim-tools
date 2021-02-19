import { DateTime } from 'luxon';
import NextAuth, { InitOptions } from 'next-auth';
import Adapters from 'next-auth/adapters';
import Providers from 'next-auth/providers';
import { AuthUser } from '../../../models';
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
  callbacks: {
    signIn: async ({ id, name }: any, account, profile) => {
      const connection = await createConnection();
      const now = DateTime.now().toJSDate();

      console.log(account, profile);

      const user: AuthUser = {
        id, 
        name: profile.username ?? profile.name ?? profile.email,
        created: now,
        updated: now,
      };

      await connection.createQueryBuilder()
        .insert()
        .into(AuthUser)
        .values(user)
        .orUpdate({ conflict_target: ['id'], overwrite: ['updated']})
        .execute();

      return true;
    },
    session: async (session, { id }: any) => {
      if (!id) {
        throw new Error('Error whilst getting session - no id present');
      }
      
      session.user['id'] = id;
      return session;
    }
  }
};

export default (req, res) => NextAuth(req, res, options);
