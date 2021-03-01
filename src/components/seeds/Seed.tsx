import { DateTime, ToRelativeCalendarOptions } from 'luxon';
import { useSession } from 'next-auth/client';
import Link from 'next/link';
import React, { SyntheticEvent } from 'react';
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

  const details = `/seeds/${seed}`;

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

  const canDelete = user?.id === (createdBy as AuthUser)?.id || user?.role === Role.ADMIN;

  const deleteSeed = () => canDelete && setDeleted(true);

  const copy = (e: SyntheticEvent) => {
    e?.preventDefault();
    setSeedCopied();
  };

  const like = (e: SyntheticEvent) => {
    e?.preventDefault();
    alert('Like clicked');
  };

  if (deleted) {
    return <></>;
  }

  const icon = <Icon className="link" name="trash" />;

  // TODO: Refactor this so that each `loading` condition is a sub-component
  return (
    <Card as={Grid.Column} className={styles.seed} href={loading ? undefined : details}>
      {loading ? (
        <Placeholder>
          <Placeholder.Image square />
        </Placeholder>
      ) : (
        <Image
          className={`${styles.preview}${canDelete ? styles.delete : undefined}`}
          label={
            canDelete && {
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
            <Card.Header className={styles.header}>{seed}</Card.Header>
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
