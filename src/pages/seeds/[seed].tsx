import { useRouter } from 'next/router';
import React from 'react';
import { Header } from 'semantic-ui-react';
import { withLayout } from '../../components';
import styles from '../../styles/pages/SeedDetail.module.scss';

const SeedDetail = () => {
  const router = useRouter();
  const { seedId } = router.query;

  return (
    <div className={styles.seedDetail}>
      <Header>{seedId}</Header>
    </div>
  );
};

export default withLayout(SeedDetail);
