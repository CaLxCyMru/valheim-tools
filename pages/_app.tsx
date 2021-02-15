import type { AppProps } from 'next/app';
import * as React from 'react';
import '../styles/globals.scss';
import 'semantic-ui-css/semantic.min.css';

function ValheimToolsApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default ValheimToolsApp;
