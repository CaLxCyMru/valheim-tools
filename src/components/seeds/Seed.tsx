import { DateTime, ToRelativeCalendarOptions } from 'luxon';
import React, { SyntheticEvent } from 'react';
import useClipboard from 'react-use-clipboard';
import { Card, Grid } from 'semantic-ui-react';
import { ISeed } from '../../models/seeds/seed.model';
import styles from '../../styles/components/seeds/Seed.module.scss';
import { Loadable } from '../../types';
import SeedAssets from './SeedAssets';
import SeedBody from './SeedBody';
import SeedMeta from './SeedMeta';
import SeedTags from './SeedTags';

const Seed = ({
  seed,
  title,
  assets,
  description,
  tags,
  overview,
  created,
  createdBy,
  loading,
}: Partial<ISeed> & Loadable): JSX.Element => {
  const details = `/seeds/${seed}`;

  return (
    <Card as={Grid.Column} className={styles.seed} href={loading ? undefined : details}>
      <SeedAssets assets={assets} createdBy={createdBy} loading={loading} />
      <SeedBody seed={seed} title={title} description={description} loading={loading} />
      <SeedMeta
        seed={seed}
        created={created}
        createdBy={createdBy}
        overview={overview}
        loading={loading}
      />
      <SeedTags tags={tags} loading={loading} />
    </Card>
  );
};

export default Seed;
