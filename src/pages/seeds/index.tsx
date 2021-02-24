import { useSession } from 'next-auth/client';
import Link from 'next/link';
import React from 'react';
import { Button, Card, Divider, Grid, Loader, Statistic } from 'semantic-ui-react';
import useSWR from 'swr';
import { withLayout } from '../../components';
import { Seed } from '../../components/seeds';
import { ISeed } from '../../models/seeds/seed.model';
import styles from '../../styles/pages/Home.module.scss';

const Seeds = () => {
  const [session] = useSession();
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
        {session && (
          <Link href="/seeds/create">
            <Button>Add new Seed</Button>
          </Link>
        )}
      </Statistic.Group>

      <Card.Group as={Grid} columns={4} className={styles.seeds}>
        {data.map((seed) => (
          <Seed key={seed.id} {...seed} />
        ))}
      </Card.Group>
    </>
  );
};

export default withLayout(Seeds);
