import delay from 'delay';
import { useSession } from 'next-auth/client';
import React, { SyntheticEvent } from 'react';
import { Button, Icon, Label, Message, Popup } from 'semantic-ui-react';
import { ISeed } from '../../models/seeds/seed.model';
import { Loadable, SessionUser } from '../../types';
import { parseApiError } from '../../utils';

const SeedLike = ({
  seed,
  overview,
  loading,
}: Pick<ISeed, 'seed' | 'overview'> & Loadable): JSX.Element => {
  const [session] = useSession();
  const [error, setError] = React.useState(undefined);

  const onError = async (error) => {
    setError(error);
    await delay(2000);
    setError(undefined);
  };

  const likeSeed = async () => {
    const response = await fetch(`/api/seeds/${seed}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(seed),
    });

    const { error } = await response.json();
    if (error) {
      await onError(error);
    }
  };

  const like = async (e: SyntheticEvent) => {
    e?.preventDefault();

    if (error) {
      return;
    }

    await likeSeed();
  };

  const getErrorComponent = () => {
    const { title, message } = parseApiError(error);
    return <Message error={true} header={title} content={message} />;
  };

  return (
    <Popup
      content={getErrorComponent}
      open={error !== undefined}
      trigger={
        <Button disabled={loading} as="div" labelPosition="right" onClick={like}>
          <Button disabled={loading} icon>
            <Icon name="heart" /> Like
          </Button>
          <Label basic pointing="left">
            {loading ? '' : overview?.likes ?? '0'}
          </Label>
        </Button>
      }
    />
  );
};

export default SeedLike;
