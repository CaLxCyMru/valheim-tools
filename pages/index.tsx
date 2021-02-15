import Head from 'next/head';
import * as React from 'react';
import { Icon } from 'semantic-ui-react';
import styles from '../styles/Home.module.scss';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Valheim Tools</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main className={styles.main}>
        <h1 className={styles.title}>
          Valheim Tools
        </h1>

        <p className={styles.description}>
          Coming Soon!
        </p>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://github.com/calxcymru/valheim-tools"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name='github' /> MIT on GitHub
        </a>
      </footer>
    </div >
  );
}
