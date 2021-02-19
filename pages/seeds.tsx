import React from 'react';
import { withLayout } from '../components';
import styles from '../styles/pages/Home.module.scss';
import { Button, Card, Divider, Icon, Image, Label, Popup, Statistic } from 'semantic-ui-react';
import { DateTime, Duration, ToRelativeCalendarOptions } from 'luxon';
import useClipboard from "react-use-clipboard";

interface IDates {
  created: Date;
  updated: Date;
}

enum SeedAssetType {
  PREVIEW,
  MAP,
  SCREENSHOT,
}

interface ISeedAsset {
  type: SeedAssetType;
  asset: string;
}

interface ISeedStatistics {
  likes: number;
  dislikes: number;
}

interface ISeed {
  id: string;
  seed: string;
  statistics: ISeedStatistics;
  description: string;
  dates: IDates;
  tags?: string[]
  assets: ISeedAsset[];
};

const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const data: ISeed[] = [
  {
    id: '1',
    seed: '7SWT9BBVEZ',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    statistics: {
      likes: randomNumber(0, 5000),
      dislikes: 0,
    },
    dates: {
      created: DateTime.now().minus(Duration.fromObject({ seconds: randomNumber(1, 6000) })).toJSDate(),
      updated: new Date(),
    },
    assets: [{
      type: SeedAssetType.PREVIEW,
      asset: '/assets/example/preview.jpg',
    }]
  },
  {
    id: '2',
    seed: '3RL7KFQ3FK',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    statistics: {
      likes: randomNumber(0, 5000),
      dislikes: 0,
    },
    dates: {
      created: DateTime.now().minus(Duration.fromObject({ seconds: randomNumber(1, 6000) })).toJSDate(),
      updated: new Date(),
    },
    assets: [{
      type: SeedAssetType.PREVIEW,
      asset: '/assets/example/preview.jpg',
    }]
  },
  {
    id: '3',
    seed: 'ASWZ7LE5N3',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    statistics: {
      likes: randomNumber(0, 5000),
      dislikes: 0,
    },
    dates: {
      created: DateTime.now().minus(Duration.fromObject({ seconds: randomNumber(1, 6000) })).toJSDate(),
      updated: new Date(),
    },
    assets: [{
      type: SeedAssetType.PREVIEW,
      asset: '/assets/example/preview.jpg',
    }]
  },
  {
    id: '4',
    seed: 'ZNMJDW11K7',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    statistics: {
      likes: randomNumber(0, 5000),
      dislikes: 0,
    },
    dates: {
      created: DateTime.now().minus(Duration.fromObject({ seconds: randomNumber(1, 6000) })).toJSDate(),
      updated: new Date(),
    },
    assets: [{
      type: SeedAssetType.PREVIEW,
      asset: '/assets/example/preview.jpg',
    }]
  }
];

const Seed = ({ seed, assets, description, statistics: { likes }, dates: { created } }: ISeed) => {
  const preview = assets?.find(({ type }) => type === SeedAssetType.PREVIEW)?.asset;

  const [isSeedCopied, setSeedCopied] = useClipboard(seed, {
    successDuration: 1000,
  });

  const getPostedDuration = () => {
    const createdDate: DateTime = created instanceof Date ? DateTime.fromJSDate(created) : created;
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
  </Card>
}

const Seeds = () => {



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

