import { WithRouterProps } from 'next/dist/client/with-router';
import Link from 'next/link';
import { withRouter } from 'next/router';
import React from 'react';
import { Menu } from 'semantic-ui-react';
import styles from '../../styles/components/global/Header.module.scss';
import { WithProviders } from '../../types';
import Login from './Login';

type HeaderProps = {} & WithProviders & WithRouterProps;

const Header = ({ providers, router }: HeaderProps) => {
  const page = router.pathname;

  return (
    <div className={styles.header}>
      <Menu className={styles.menu} attached="top" stackable inverted size="large">
        <Menu.Item header className={styles.logo}>
          Valheim Tools
        </Menu.Item>
        <Menu.Item className="item" name="home" active={page === '/' || page === '/home'}>
          <Link href="/">Home</Link>
        </Menu.Item>
        <Menu.Item name="seeds" active={page === '/seeds' || page === '/seeds/'}>
          <Link href="/seeds">Seeds</Link>
        </Menu.Item>
        <Login providers={providers} />
      </Menu>
    </div>
  );
};

export default withRouter(Header);
