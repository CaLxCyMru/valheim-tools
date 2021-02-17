import React from 'react';
import { withLayout } from '../components';
import styles from '../styles/pages/Home.module.scss';

const Seeds = () => (
  <div className={styles.seeds}>
    <main>
      <h1>
        Seeds
        </h1>
    </main>
  </div >
);

export default withLayout(Seeds);

