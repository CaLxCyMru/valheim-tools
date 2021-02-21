import { NextPage } from 'next';
import React from 'react';
import { Container, Segment } from 'semantic-ui-react';
import styles from '../../styles/hoc/WithLayout.module.scss';
import { Footer, Header } from '../global';

export const withLayout = (Page: NextPage): ((props) => JSX.Element) => {
  const layoutFn: (props) => JSX.Element = ({ providers, ...props }): JSX.Element => (
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
