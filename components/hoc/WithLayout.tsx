import React, { createRef } from "react";
import { Container } from "semantic-ui-react";
import { Footer, Header } from "../global";

export const withLayout = (Page) => {
  const appRef: React.Ref<any> = createRef();

  return ({ providers, ...props }) => (
    <div ref={appRef}>
      <Header providers={providers} />
      <Container>
        <Page {...props} />
      </Container>
      <Footer />
    </div>
  );;
}