import { signIn, signOut, useSession } from 'next-auth/client';
import Head from 'next/head';
import * as React from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import styles from '../styles/Home.module.scss';

export default function Home() {
  const [activeItem, setActiveItem] = React.useState('home');

  const handleItemClick = (event, { name }) => {
    setActiveItem(name);
  };

  const [session] = useSession();

  return (
    <div className={styles.container}>
      <Head>
        <title>Valheim Tools</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Menu>
        <Menu.Item
          name='home'
          active={activeItem === 'home'}
          onClick={handleItemClick}
        >
          Home
        </Menu.Item>

        <Menu.Item
          name='seeds'
          active={activeItem === 'seeds'}
          onClick={handleItemClick}
        >
          Seeds
        </Menu.Item>

        {!session &&

          <Menu.Item
            name='login'
            active={activeItem === 'login'}
            onClick={() => signIn()}
          >
            Log In
          </Menu.Item>
        }

        {session &&

          <Menu.Item
            name='logout'
            active={activeItem === 'logout'}
            onClick={() => signOut()}
          >
            Log out of {session.user.email}
          </Menu.Item>
        }
      </Menu>


      <main className={styles.main}>
        <h1 className={styles.title}>
          Valheim Tools
        </h1>

        <p className={styles.description}>
          Coming Soon!
        </p>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://github.com/calxcymru/valheim-tools"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name='github' /> MIT on GitHub
        </a>
      </footer>
    </div >
  );
}
