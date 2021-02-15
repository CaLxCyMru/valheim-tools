import type { AppProps } from 'next/app';
import * as React from 'react';
import '../styles/globals.css';

function ValheimToolsApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default ValheimToolsApp;
