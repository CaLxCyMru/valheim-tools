import { useSession } from 'next-auth/client';
import React, { SyntheticEvent } from 'react';
import { Button, Icon, Label } from 'semantic-ui-react';
import { ISeed } from '../../models/seeds/seed.model';
import { Loadable, SessionUser } from '../../types';

const SeedLike = ({ overview, loading }: Pick<ISeed, 'overview'> & Loadable): JSX.Element => {
  const [session] = useSession();
  const user = session?.user as SessionUser;

  const like = (e: SyntheticEvent) => {
    e?.preventDefault();

    alert('Like clicked');
  };

  return (
    <Button disabled={loading} as="div" labelPosition="right" onClick={like}>
      <Button disabled={loading} icon>
        <Icon name="heart" /> Like
      </Button>
      <Label basic pointing="left">
        {loading ? '' : overview?.likes ?? '0'}
      </Label>
    </Button>
  );
};

export default SeedLike;
