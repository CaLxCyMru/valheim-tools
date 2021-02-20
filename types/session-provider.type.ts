import { SessionProvider } from 'next-auth/client';

export type SessionProviders = {
  [provider: string]: SessionProvider;
};

export type WithProviders = {
  providers: SessionProviders;
};
