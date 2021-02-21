import { NextPage, NextPageContext } from 'next';
import { getSession } from 'next-auth/client';
import Router from 'next/router';
import React from 'react';

export const withAuth = (Page: NextPage): ((props) => JSX.Element) => {
  const withAuth = (props) => {
    return <Page {...props} />;
  };

  withAuth.getInitialProps = async (ctx: NextPageContext) => {
    const session = await getSession(ctx);
    const initialProps = Page.getInitialProps ? await Page.getInitialProps(ctx) : {};

    if (!session) {
      const { res } = ctx;
      if (res) {
        res.writeHead(307, { Location: '/' });
        res.end();
      } else {
        Router.replace('/');
      }
    }

    return { ...initialProps, session };
  };

  return withAuth;
};
