import React from 'react';
import { Card, Placeholder } from 'semantic-ui-react';
import { ISeed } from '../../models/seeds/seed.model';
import styles from '../../styles/components/seeds/SeedBody.module.scss';
import { Loadable } from '../../types';

const SeedTitle = ({
  seed,
  title,
  description,
  loading,
}: Pick<ISeed, 'seed' | 'title' | 'description'> & Loadable): JSX.Element => {
  const loader = () => (
    <Placeholder>
      <Placeholder.Header>
        <Placeholder.Line length="long" />
        <Placeholder.Line length="short" />
      </Placeholder.Header>
      <Placeholder.Paragraph>
        <Placeholder.Line length="full" />
      </Placeholder.Paragraph>
    </Placeholder>
  );

  const render = () => {
    if (loading) {
      return loader();
    }

    return (
      <>
        <Card.Header className={styles.header}>{seed}</Card.Header>
        {title && <Card.Header className={styles.title}>{title}</Card.Header>}
        <Card.Description className={styles.description}>{description}</Card.Description>
      </>
    );
  };

  return <Card.Content className={styles.body}>{render()}</Card.Content>;
};

export default SeedTitle;
