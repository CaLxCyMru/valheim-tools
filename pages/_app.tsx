import type { AppProps } from 'next/app';
import * as React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Provider } from 'next-auth/client';
import Head from 'next/head';
import { Footer, Header } from '../components';

function ValheimToolsApp({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <Head>
        <title>Valheim Tools</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <Component {...pageProps} />

      <Footer />
    </Provider>
  );
}

export default ValheimToolsApp;
