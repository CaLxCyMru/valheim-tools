import { signIn, signOut, useSession } from 'next-auth/client';
import React from 'react';
import { Button, Image, Loader, Menu, Modal } from 'semantic-ui-react';
import { SessionProviders } from '../../types';
import styles from '../../styles/components/global/Login.module.scss';

type LoginProps = {
  providers: SessionProviders;
};

const getLogoForProviders = (id: string) => {
  switch (id) {
    case 'discord':
      return '/assets/login/discord.svg';
    default:
      throw new Error(`Unable to get logo for provider with id '${id}'`);
  }
}

const Login = ({ providers }: LoginProps) => {
  const [session, loading] = useSession();
  const [open, setOpen] = React.useState(false);

  const closeLoginModal = () => setOpen(false);

  const login = () => setOpen(true);

  const logout = () => signOut();

  const getLoginState = () => {
    if (loading) {
      return <Menu.Item>
        <Loader active size='tiny' />
      </Menu.Item>;
    }

    if (!session) {
      return (<>
        <Menu.Item
          name='login'
        >
          <Button className={styles.login} primary onClick={login}>Log In</Button>
        </Menu.Item>
        <Modal
          size='tiny'
          open={open}
          onClose={closeLoginModal}

        >
          <Modal.Header>Login</Modal.Header>

          <Modal.Content>
            {Object.values(providers).map(provider => (
              <div key={provider.name} className={styles.provider}>
                <Button className={styles.loginButton} primary onClick={() => signIn(provider.id)} basic>
                  <Image className={styles.logo} size='mini' src={getLogoForProviders(provider.id)} />
                  <span className={styles.providerName}>
                    Sign in with {provider.name}
                  </span>
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
      )
    }

    return <Menu.Item
      name='logout'
    >
      {session.user.image &&
        <Image src={session.user.image} size='mini' circular className={styles.avatar} />
      }
      {session.user.name ?? session.user.email}
      <Button className={styles.logout} color='red' onClick={logout}>Log Out</Button>
    </Menu.Item>
  }

  return (
    <Menu.Menu position='right' className={styles.login}>
      {getLoginState()}
    </Menu.Menu>
  );

};


export default Login;