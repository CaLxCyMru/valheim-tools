import { NextApiResponse } from 'next';
import React from 'react';
import { withAuth, withLayout, withRedirect } from '../components';
import styles from '../styles/pages/Home.module.scss';

const Home = () => (
  <div className={styles.home}>
    <main>
      <h1>Valheim Tools</h1>
      <p>Coming Soon!</p>
    </main>
  </div>
);
export default withRedirect(withLayout(Home), '/seeds');
