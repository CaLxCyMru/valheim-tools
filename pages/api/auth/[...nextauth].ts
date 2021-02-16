import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const options = {
  // full list of providers can be found https://next-auth.js.org/configuration/providers
  providers: [
    Providers.Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
};

export default (req, res) => NextAuth(req, res, options);
