import useVisibilitySensor from '@rooks/use-visibility-sensor';
import delay from 'delay';
import { useSession } from 'next-auth/client';
import Link from 'next/link';
import React from 'react';
import { Button, Card, Divider, Grid, Header, Loader, Statistic } from 'semantic-ui-react';
import { useSWRInfinite } from 'swr';
import { keyType } from 'swr/dist/types';
import { withLayout } from '../../components';
import { Seed } from '../../components/seeds';
import { ISeed } from '../../models/seeds/seed.model';
import styles from '../../styles/pages/Seeds.module.scss';
import { ApiResponse } from '../../types';

const API_URL = '/api/seeds';
const PAGE_SIZE = 5;
const RATE_LIMIT_MS = Number(process.env.NEXT_PUBLIC_RATE_LIMIT_MS ?? 1000);

const getKey = (pageIndex: number, previousPageData: ApiResponse<ISeed[]>) => {
  if (previousPageData && !previousPageData.data) return null;

  if (pageIndex === 0) {
    return `${API_URL}?pageSize=${PAGE_SIZE}`;
  }

  return `${API_URL}?cursor=${previousPageData.meta.next}`;
};

const Seeds = () => {
  const [session] = useSession();
  const [isRateLimited, setIsRateLimited] = React.useState(false);
  const { data: pages = [], size, setSize, error } = useSWRInfinite<ApiResponse<ISeed[]>>(
    getKey as () => keyType,
  );

  const root = React.useRef(null);

  const data = pages.map(({ data }) => data).flat();
  const meta = pages[pages.length - 1]?.meta;

  const isLoadingInitialData = !pages && !error;
  const isLoadingMore =
    isLoadingInitialData || (size > 0 && pages && typeof pages[size - 1] === 'undefined');

  const { isVisible } = useVisibilitySensor(root, {
    intervalCheck: false,
    scrollCheck: true,
    resizeCheck: true,
    partialVisibility: 'bottom',
  });

  if (!isRateLimited && isVisible && !isLoadingMore && meta?.total > data?.length) {
    setSize(size + 1);
    setIsRateLimited(true);
    delay(RATE_LIMIT_MS).then(() => {
      setIsRateLimited(false);
    });
  }

  const getLoadingCards = (cards = PAGE_SIZE) =>
    Array.from({ length: cards }).map(() => ({ loading: true }));

  return (
    <div ref={root} className={styles.seeds}>
      <Header size={'large'}>Seed</Header>
      <p>
        A seed is a random generated text which is used to procedurally generated generated Valheim
        world
      </p>
      <Divider />

      <Statistic.Group className={styles.stats}>
        <Statistic>
          <Statistic.Value>
            {meta ? (
              meta.total
            ) : (
              <Loader className="elastic" style={{ fontSize: '1rem' }} inline active />
            )}
          </Statistic.Value>
          <Statistic.Label>Seeds submitted</Statistic.Label>
        </Statistic>
        {session && (
          <Link href="/seeds/create">
            <Button>Add new Seed</Button>
          </Link>
        )}
      </Statistic.Group>

      <Card.Group as={Grid} columns={4} doubling stackable className={styles.cards}>
        {data && data.map((seed) => <Seed key={seed.id} {...seed} />)}
        {isLoadingMore &&
          getLoadingCards().map((loading, index) => (
            <Seed key={`seedLoader-${index}`} {...loading} />
          ))}
      </Card.Group>
    </div>
  );
};

export default withLayout(Seeds);
