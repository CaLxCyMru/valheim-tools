import { DateTime, ToRelativeCalendarOptions } from 'luxon';
import { session, useSession } from 'next-auth/client';
import React from 'react';
import useClipboard from "react-use-clipboard";
import { Button, Card, Icon, Image, Label, Popup } from 'semantic-ui-react';
import { Role, SeedAssetType } from '../../enums';
import { ISeed } from '../../models';
import { SessionUser } from '../../types';

const Seed = ({ seed, assets, description, tags, statistics: { likes }, created, createdBy }: ISeed) => {
  const [session] = useSession();

  const user = session?.user as SessionUser;

  const preview = assets?.find(({ type }) => type === SeedAssetType.PREVIEW)?.url;

  const [isSeedCopied, setSeedCopied] = useClipboard(seed, {
    successDuration: 1000,
  });

  // TODO: HACK for now as I don't want to actually delete them from the DB. Just use some react state magic ✨
  const [deleted, setDeleted] = React.useState(false);

  const getPostedDuration = () => {
    const createdDate: DateTime = typeof created === 'string' ? DateTime.fromISO(created) : undefined;
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

  const deleteSeed = () => setDeleted(true);

  if (deleted) {
    return <></>;
  }

  const icon = <Icon className='link' name='trash' />;

  return <Card>
    <Image label={
      (user?.id === createdBy.id || user?.role === Role.ADMIN) &&
      { as: 'a', color: 'red', corner: 'right', icon, onClick: deleteSeed, size: 'large' }
    }
      src={preview} />
    <Card.Content>
      <Card.Header>{seed}</Card.Header>
      <Card.Description>
        {description}
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <Card.Meta style={{ marginBottom: '10px' }}>
        Posted {getPostedDuration()}
      </Card.Meta>
      <Button as='div' labelPosition='right' onClick={() => alert('Like Button clicked')}>
        <Button icon>
          <Icon name='heart' />{' '}
          Like
        </Button>
        <Label basic pointing='left'>
          {likes}
        </Label>
      </Button>
      <Popup content='Seed Copied' open={isSeedCopied} trigger={
        <Button as='div' labelPosition='right' onClick={setSeedCopied} floated='right'>
          <Button>
            Copy
          </Button>
          <Label as='a'>
            <Icon name='clipboard' />
          </Label>
        </Button>
      } />
    </Card.Content>
    {tags &&
      <Card.Content>
        <Card.Meta>
          Posted by {createdBy.name}
        </Card.Meta>
        <Label.Group circular>
          {tags.map((tag) => <Label>{`#${tag}`}</Label>)}
        </Label.Group>
      </Card.Content>
    }
  </Card>
}

export default Seed;