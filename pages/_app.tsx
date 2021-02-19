import { Provider, providers } from 'next-auth/client';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import '../styles/global.scss';
import App from 'next/app'
import { WithProviders } from '../types';
import { SWRConfig } from 'swr';

export type ValheimToolsAppProps = AppProps & WithProviders;

function ValheimToolsApp({ Component, pageProps, providers }: ValheimToolsAppProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        // @ts-ignore
        fetcher: (...args) => fetch(...args).then(res => res.json())
      }}
    >
      <Provider session={pageProps.session} options={{
        clientMaxAge: 60,
        keepAlive: 3 * 60
      }}>
        <Head>
          <title>Valheim Tools</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Component {...pageProps} providers={providers} />
      </Provider>
    </SWRConfig>
  );
}

ValheimToolsApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  const loginProviders = await providers();
  return { ...appProps, providers: loginProviders };
}

export default ValheimToolsApp;
