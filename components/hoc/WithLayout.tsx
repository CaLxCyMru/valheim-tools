import React, { createRef } from 'react';
import { Container, Segment } from 'semantic-ui-react';
import styles from '../../styles/hoc/WithLayout.module.scss';
import { Footer, Header } from '../global';

export const withLayout = (Page) => {
  const appRef: React.Ref<any> = createRef();

  return ({ providers, ...props }) => (
    <div className={styles.layout} ref={appRef}>
      <Header providers={providers} />
      <Segment vertical className={styles.page}>
        <Container>
          <Page {...props} />
        </Container>
      </Segment>
      <Footer />
    </div>
  );
};
