import type { AppProps } from 'next/app';
import * as React from 'react';
import '../styles/globals.scss';
import 'semantic-ui-css/semantic.min.css';
import { Provider } from 'next-auth/client';

function ValheimToolsApp({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default ValheimToolsApp;
