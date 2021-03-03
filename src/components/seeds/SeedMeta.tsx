import { DateTime, ToRelativeCalendarOptions } from 'luxon';
import React, { SyntheticEvent } from 'react';
import useClipboard from 'react-use-clipboard';
import { Button, Card, Icon, Label, Placeholder, Popup } from 'semantic-ui-react';
import { AuthUser } from '../../models';
import { ISeed } from '../../models/seeds/seed.model';
import { Loadable } from '../../types';

const SeedMeta = ({
  seed,
  created,
  createdBy,
  overview,
  loading,
}: Pick<ISeed, 'seed' | 'created' | 'createdBy' | 'overview'> & Loadable): JSX.Element => {
  const [isSeedCopied, setSeedCopied] = useClipboard(seed, {
    successDuration: 1000,
  });

  const getPostedDuration = () => {
    const createdDate: DateTime =
      typeof created === 'string' ? DateTime.fromISO(created) : undefined;

    if (!createdDate) {
      return undefined;
    }

    const base = DateTime.now();
    const diff = base.diff(createdDate);

    const options: ToRelativeCalendarOptions = { base };

    const diffAsSeconds = diff.as('seconds');

    if (diffAsSeconds <= 20) {
      return 'a few seconds ago';
    }

    if (diffAsSeconds < 60) {
      options.unit = 'seconds';
    } else if (diff.as('minutes') < 60) {
      options.unit = 'minutes';
    } else if (diff.as('hours') < 24) {
      options.unit = 'hours';
    }

    return createdDate.toRelativeCalendar(options);
  };

  const copy = (e: SyntheticEvent) => {
    e?.preventDefault();
    setSeedCopied();
  };

  const like = (e: SyntheticEvent) => {
    e?.preventDefault();
    alert('Like clicked');
  };

  const loader = () => (
    <Placeholder>
      <Placeholder.Line length="short" />
    </Placeholder>
  );

  const render = () => {
    return (
      <Card.Content extra>
        <Card.Meta
          style={loading ? { marginBottom: '10px', marginTop: '0' } : { marginBottom: '5px' }}
        >
          {loading ? (
            loader()
          ) : (
            <>
              Posted {getPostedDuration()} by {(createdBy as AuthUser)?.name}
            </>
          )}
        </Card.Meta>
        <Button disabled={loading} as="div" labelPosition="right" onClick={like}>
          <Button disabled={loading} icon>
            <Icon name="heart" /> Like
          </Button>
          <Label basic pointing="left">
            {loading ? '' : overview?.likes ?? '0'}
          </Label>
        </Button>
        <Popup
          content="Seed Copied"
          open={isSeedCopied}
          trigger={
            <Button
              disabled={loading}
              as="div"
              labelPosition="right"
              onClick={copy}
              floated="right"
            >
              <Button disabled={loading}>Copy</Button>
              <Label>
                <Icon name="clipboard" />
              </Label>
            </Button>
          }
        />
      </Card.Content>
    );
  };

  return render();
};

export default SeedMeta;
