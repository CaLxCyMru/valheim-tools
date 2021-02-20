import React from 'react';
import { Container, Segment } from 'semantic-ui-react';
import styles from '../../styles/hoc/WithLayout.module.scss';
import { Footer, Header } from '../global';

export const withLayout = (Page: React.ComponentType): unknown => {
  const layoutFn = ({ providers, ...props }) => (
    <div className={styles.layout}>
      <Header providers={providers} />
      <Segment vertical className={styles.page}>
        <Container>
          <Page {...props} />
        </Container>
      </Segment>
      <Footer />
    </div>
  );

  return layoutFn;
};
