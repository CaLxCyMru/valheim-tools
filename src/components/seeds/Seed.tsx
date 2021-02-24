import { DateTime, ToRelativeCalendarOptions } from 'luxon';
import { useSession } from 'next-auth/client';
import React from 'react';
import useClipboard from 'react-use-clipboard';
import { Button, Card, Grid, Icon, Image, Label, Popup } from 'semantic-ui-react';
import { Role, SeedAssetType } from '../../enums';
import { AuthUser } from '../../models';
import { ISeed } from '../../models/seeds/seed.model';
import styles from '../../styles/components/seeds/Seed.module.scss';
import { SessionUser } from '../../types';

const Seed = ({
  seed,
  title,
  assets,
  description,
  tags,
  overview,
  created,
  createdBy,
}: ISeed): JSX.Element => {
  const [session] = useSession();

  const user = session?.user as SessionUser;

  const preview = assets?.find(({ type }) => type === SeedAssetType.PREVIEW)?.path;

  const [isSeedCopied, setSeedCopied] = useClipboard(seed, {
    successDuration: 1000,
  });

  // TODO: HACK for now as I don't want to actually delete them from the DB. Just use some react state magic ✨
  const [deleted, setDeleted] = React.useState(false);

  const getPostedDuration = () => {
    const createdDate: DateTime =
      typeof created === 'string' ? DateTime.fromISO(created) : undefined;
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

  const icon = <Icon className="link" name="trash" />;

  return (
    <Card as={Grid.Column} className={styles.seed}>
      <Image
        className={styles.preview}
        label={
          (user?.id === (createdBy as AuthUser).id || user?.role === Role.ADMIN) && {
            as: 'a',
            color: 'red',
            corner: 'right',
            icon,
            onClick: deleteSeed,
            size: 'large',
          }
        }
        src={`${process.env.NEXT_PUBLIC_SEED_ASSET_BASE_URL}/${preview}`}
      />
      <Card.Content>
        <Card.Header>{seed}</Card.Header>
        {title && <Card.Header className={styles.title}>{title}</Card.Header>}
        <Card.Description className={styles.description}>{description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Card.Meta style={{ marginBottom: '5px' }}>
          Posted {getPostedDuration()} by {(createdBy as AuthUser).name}
        </Card.Meta>
        <Button as="div" labelPosition="right" onClick={() => alert('Like Button clicked')}>
          <Button icon>
            <Icon name="heart" /> Like
          </Button>
          <Label basic pointing="left">
            {overview?.likes ?? '0'}
          </Label>
        </Button>
        <Popup
          content="Seed Copied"
          open={isSeedCopied}
          trigger={
            <Button as="div" labelPosition="right" onClick={setSeedCopied} floated="right">
              <Button>Copy</Button>
              <Label as="a">
                <Icon name="clipboard" />
              </Label>
            </Button>
          }
        />
      </Card.Content>
      <Card.Content>
        {tags && (
          <Label.Group circular>
            {tags.map(({ id, tag }) => (
              <Label key={id}>{`#${tag}`}</Label>
            ))}
          </Label.Group>
        )}
      </Card.Content>
    </Card>
  );
};

export default Seed;
