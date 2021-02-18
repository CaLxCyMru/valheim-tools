import React, { createRef } from "react";
import { Footer, Header } from "../global";

export const withLayout = (Page) => {
  const appRef: React.Ref<any> = createRef();

  return ({ providers, ...props }) => (
    <div ref={appRef}>
      <Header providers={providers} />
      <Page {...props} />
      <Footer />
    </div>
  );;
}