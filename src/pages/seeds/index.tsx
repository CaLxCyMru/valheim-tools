import React from 'react';
import { Card, Divider, Loader, Statistic } from 'semantic-ui-react';
import useSWR from 'swr';
import { withLayout } from '../../components';
import { Seed } from '../../components/seeds';
import { ISeed } from '../../models/seeds/seed.model';
import styles from '../../styles/pages/Home.module.scss';
import fetch from 'unfetch';
const Seeds = () => {
  // TODO: Look into SWR to ensure that we do not spam the server every 2 seconds
  const { data } = useSWR<ISeed[]>('/api/seeds');

  if (!data) {
    return <Loader active />;
  }

  return (
    <>
      <h1>Seeds</h1>
      <p>
        A seed is a random generated text which is used to procedurally generated generated Valheim
        world.
      </p>
      <Divider />
      <Statistic.Group>
        <Statistic>
          <Statistic.Value>{data.length}</Statistic.Value>
          <Statistic.Label>Seeds submitted</Statistic.Label>
        </Statistic>
      </Statistic.Group>

      <Card.Group className={styles.seeds}>
        {data.map((seed) => (
          <Seed key={seed.id} {...seed} />
        ))}
      </Card.Group>
    </>
  );
};

export default withLayout(Seeds);
