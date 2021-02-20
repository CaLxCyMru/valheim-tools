import { Provider, providers } from 'next-auth/client';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import '../styles/global.scss';
import App from 'next/app';
import { SWRConfig } from 'swr';
import fetch from 'unfetch';
import { WithProviders } from '../types';

export type ValheimToolsAppProps = AppProps & WithProviders;

function ValheimToolsApp({
  Component,
  pageProps,
  providers: appProviders,
}: ValheimToolsAppProps): JSX.Element {
  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        fetcher: (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json()),
      }}
    >
      <Provider
        session={pageProps.session}
        options={{
          clientMaxAge: 60,
          keepAlive: 3 * 60,
        }}
      >
        <Head>
          <title>Valheim Tools</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Component {...pageProps} providers={appProviders} />
      </Provider>
    </SWRConfig>
  );
}

ValheimToolsApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  const loginProviders = await providers();
  return { ...appProps, providers: loginProviders };
};

export default ValheimToolsApp;
