import NextAuth, { InitOptions } from 'next-auth';
import Adapters from 'next-auth/adapters';
import Providers from 'next-auth/providers';

const options: InitOptions = {
  // full list of providers can be found https://next-auth.js.org/configuration/providers
  providers: [
    Providers.Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  adapter:  Adapters.TypeORM.Adapter(
    {
      type: 'mysql',
      host: String(process.env.AUTH_DB_HOST ?? '127.0.0.1'),
      port: Number(process.env.AUTH_DB_PORT ?? 3306) ,
      username: String(process.env.AUTH_DB_USERNAME),
      password: String(process.env.AUTH_DB_PASSWORD),
      database: String(process.env.AUTH_DB_NAME),
      synchronize: Boolean(process.env.AUTH_DB_SYNCHRONIZE ?? false),
    }
  )
};

export default (req, res) => NextAuth(req, res, options);
