import React, { createRef } from "react";
import { Container, Segment } from "semantic-ui-react";
import { Footer, Header } from "../global";
import styles from '../../styles/hoc/WithLayout.module.scss';

export const withLayout = (Page) => {
  const appRef: React.Ref<any> = createRef();

  return ({ providers, ...props }) => (
    <div className={styles.layout} ref={appRef}>
      <Header providers={providers} />
      <Segment className={styles.page}>
        <Container>
          <Page {...props} />
        </Container>
      </Segment>
      <Footer />
    </div>
  );;
}