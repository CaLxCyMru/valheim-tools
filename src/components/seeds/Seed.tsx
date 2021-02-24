import { DateTime, ToRelativeCalendarOptions } from 'luxon';
import { useSession } from 'next-auth/client';
import React from 'react';
import useClipboard from 'react-use-clipboard';
import { Button, Card, Grid, Icon, Image, Label, Placeholder, Popup } from 'semantic-ui-react';
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
  loading,
}: Partial<ISeed> & { loading?: boolean }): JSX.Element => {
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

  const deleteSeed = () => setDeleted(true);

  if (deleted) {
    return <></>;
  }

  const icon = <Icon className="link" name="trash" />;

  return (
    <Card as={Grid.Column} className={styles.seed}>
      {loading ? (
        <Placeholder>
          <Placeholder.Image square />
        </Placeholder>
      ) : (
        <Image
          className={styles.preview}
          label={
            (user?.id === (createdBy as AuthUser)?.id || user?.role === Role.ADMIN) && {
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
      )}
      <Card.Content>
        {loading ? (
          <Placeholder>
            <Placeholder.Header>
              <Placeholder.Line length="long" />
              <Placeholder.Line length="short" />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line length="full" />
            </Placeholder.Paragraph>
          </Placeholder>
        ) : (
          <>
            <Card.Header>{seed}</Card.Header>
            {title && <Card.Header className={styles.title}>{title}</Card.Header>}
            <Card.Description className={styles.description}>{description}</Card.Description>
          </>
        )}
      </Card.Content>
      <Card.Content extra>
        <Card.Meta
          style={loading ? { marginBottom: '10px', marginTop: '0' } : { marginBottom: '5px' }}
        >
          {loading ? (
            <Placeholder>
              <Placeholder.Line length="short" />
            </Placeholder>
          ) : (
            <>
              Posted {getPostedDuration()} by {(createdBy as AuthUser)?.name}
            </>
          )}
        </Card.Meta>
        <Button
          disabled={loading}
          as="div"
          labelPosition="right"
          onClick={() => alert('Like Button clicked')}
        >
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
              onClick={setSeedCopied}
              floated="right"
            >
              <Button disabled={loading}>Copy</Button>
              <Label as="a">
                <Icon name="clipboard" />
              </Label>
            </Button>
          }
        />
      </Card.Content>
      <Card.Content>
        <Label.Group circular>
          {loading ? (
            <Placeholder>
              <Placeholder.Paragraph>
                <Placeholder.Line length="short" />
              </Placeholder.Paragraph>
            </Placeholder>
          ) : (
            <> {tags && tags.map(({ id, tag }) => <Label key={id}>{`#${tag}`}</Label>)}</>
          )}
        </Label.Group>
      </Card.Content>
    </Card>
  );
};

export default Seed;
