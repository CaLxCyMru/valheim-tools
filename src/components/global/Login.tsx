import { signIn, signOut, useSession } from 'next-auth/client';
import React from 'react';
import { Button, Header, Image, Menu, Modal } from 'semantic-ui-react';
import styles from '../../styles/components/global/Login.module.scss';
import { SessionProviders } from '../../types';

type LoginProps = {
  providers: SessionProviders;
};

const assetsPath = '/assets/login';

const getLogoForProviders = (id: string) => {
  let logo: string;
  switch (id) {
    case 'discord':
      logo = 'discord.svg';
      break;
    case 'twitch':
      logo = 'twitch.svg';
      break;
    case 'google':
      logo = 'google.svg';
      break;
    default:
      throw new Error(`Unable to get logo for provider with id '${id}'`);
  }

  return `${assetsPath}/${logo}`;
};

const Login = ({ providers }: LoginProps): JSX.Element => {
  const [session, loading] = useSession();

  const [open, setOpen] = React.useState(false);

  const closeLoginModal = () => setOpen(false);

  const login = () => setOpen(true);

  const logout = () => signOut();

  const getLoginState = () => {
    if (!session) {
      return (
        <>
          <Menu.Item name="login">
            <Button className={styles.login} color="violet" loading={loading} onClick={login}>
              Log In
            </Button>
          </Menu.Item>
          <Modal className={styles.loginModal} size="tiny" open={open} onClose={closeLoginModal}>
            <Modal.Header>Login</Modal.Header>
            <Modal.Content>
              <Header textAlign="center">Please select a login provider</Header>
              {Object.values(providers).map((provider) => (
                <div key={provider.name} className={styles.provider}>
                  <Button
                    className={styles.loginButton}
                    basic
                    color="grey"
                    onClick={() => signIn(provider.id)}
                  >
                    <Image
                      className={styles.logo}
                      size="mini"
                      src={getLogoForProviders(provider.id)}
                    />
                    <span className={styles.providerName}>Sign in with {provider.name}</span>
                  </Button>
                </div>
              ))}
            </Modal.Content>

            <Modal.Actions>
              <Button negative onClick={closeLoginModal}>
                Cancel
              </Button>
            </Modal.Actions>
          </Modal>
        </>
      );
    }

    return (
      <Menu.Item name="logout">
        {session.user.image && (
          <Image src={session.user.image} size="mini" circular className={styles.avatar} />
        )}
        {session.user.name ?? session.user.email}
        <Button className={styles.logout} color="violet" loading={loading} onClick={logout}>
          Log Out
        </Button>
      </Menu.Item>
    );
  };

  return (
    <Menu.Menu position="right" className={styles.login}>
      {getLoginState()}
    </Menu.Menu>
  );
};

export default Login;
