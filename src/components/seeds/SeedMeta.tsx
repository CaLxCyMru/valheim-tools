import React from 'react';
import { Card } from 'semantic-ui-react';
import { ISeed } from '../../models/seeds/seed.model';
import { Loadable } from '../../types';
import SeedCopy from './SeedCopy';
import SeedLike from './SeedLike';
import SeedPostedBy from './SeedPostedBy';

const SeedMeta = ({
  seed,
  created,
  createdBy,
  overview,
  loading,
}: Pick<ISeed, 'seed' | 'created' | 'createdBy' | 'overview'> & Loadable): JSX.Element => {
  const render = () => {
    return (
      <Card.Content extra>
        <SeedPostedBy created={created} createdBy={createdBy} loading={loading} />
        <SeedLike overview={overview} loading={loading} />
        <SeedCopy seed={seed} loading={loading} />
      </Card.Content>
    );
  };

  return render();
};

export default SeedMeta;
