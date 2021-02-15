import type { AppProps } from 'next/app';
import * as React from 'react';
import '../styles/globals.css';
import 'semantic-ui-css/semantic.min.css';

function ValheimToolsApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default ValheimToolsApp;
