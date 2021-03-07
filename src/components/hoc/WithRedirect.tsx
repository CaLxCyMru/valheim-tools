import { NextPage, NextPageContext } from 'next';
import Router from 'next/router';
import React from 'react';

export const withRedirect = (Page: NextPage, redirectPage = '/'): ((props) => JSX.Element) => {
  const withRedirect = (props) => {
    return <Page {...props} />;
  };

  withRedirect.getInitialProps = async (ctx: NextPageContext) => {
    const initialProps = Page.getInitialProps ? await Page.getInitialProps(ctx) : {};

    const { res } = ctx;
    if (res) {
      res.writeHead(307, { Location: redirectPage });
      res.end();
    } else {
      Router.replace(redirectPage);
    }

    return initialProps;
  };

  return withRedirect;
};
