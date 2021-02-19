import React from 'react';
import { withLayout } from '../components';
import styles from '../styles/pages/Home.module.scss';
import { Button, Card, Divider, Icon, Image, Label, Loader, Popup, Statistic } from 'semantic-ui-react';
import { DateTime, Duration, ToRelativeCalendarOptions } from 'luxon';
import useClipboard from "react-use-clipboard";
import { ISeed } from '../models';
import { SeedAssetType } from '../enums';
import useSWR from 'swr';

const Seed = ({ seed, assets, description, tags, statistics: { likes }, created }: ISeed) => {
  const preview = assets?.find(({ type }) => type === SeedAssetType.PREVIEW)?.url;

  const [isSeedCopied, setSeedCopied] = useClipboard(seed, {
    successDuration: 1000,
  });

  const getPostedDuration = () => {
    const createdDate: DateTime = typeof created === 'string' ? DateTime.fromISO(created) : undefined;
    const base = DateTime.now();
    console.log(createdDate)
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

  return <Card>
    <Image src={preview} />
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
        <Label.Group circular>
          {tags.map((tag) => <Label>{`#${tag}`}</Label>)}
        </Label.Group>
      </Card.Content>
    }
  </Card>
}


const Seeds = () => {
  const { data, isValidating } = useSWR<ISeed>('/api/seeds', { revalidateOnFocus: false, refreshWhenHidden: false, revalidateOnReconnect: false, refreshWhenOffline: false, revalidateOnMount: false });

  if (!data) {
    return <Loader active />
  }

  return (
    <>
      <h1>Seeds</h1>
      <p>
        A seed is a random generated text which is used to procedurally generated generated Valheim world.
      </p>
      <Divider />
      <Statistic.Group>
        <Statistic>
          <Statistic.Value>{data.length}</Statistic.Value>
          <Statistic.Label>Seeds submitted</Statistic.Label>
        </Statistic>
      </Statistic.Group>
      <Card.Group className={styles.seeds}>
        {data.sort((first, second) => second.statistics.likes - first.statistics.likes).map((seed) => <Seed key={seed.id} {...seed} />)}
      </Card.Group >
    </>
  );
}

export default withLayout(Seeds);

