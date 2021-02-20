import React from 'react';
import { withLayout } from '../components';
import styles from '../styles/pages/Home.module.scss';

const Home = () => (
  <div className={styles.home}>
    <main>
      <h1>Valheim Tools</h1>
      <p>Coming Soon!</p>
    </main>
  </div>
);

export default withLayout(Home);
