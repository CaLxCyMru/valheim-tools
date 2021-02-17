import { signIn, signOut, useSession } from 'next-auth/client';
import React from 'react';
import { Loader, Menu } from 'semantic-ui-react';
import styles from '../../styles/components/global/Login.module.scss';

type LoginProps = {

};

const Login = (props: LoginProps) => {
  const [session, loading] = useSession();

  const loader = <Loader active size='tiny' />;

  return (
    <Menu.Menu position='right' className={styles.login}>
      {!session &&
        <Menu.Item
          name='login'
          onClick={() => signIn()}
        >
          {loading ? loader : <>Log In</>}
        </Menu.Item>
      }

      {session &&
        <Menu.Item
          name='logout'
          onClick={() => signOut()}
        >
          {loading ? loader : <>Log out of {session.user.email}</>}
        </Menu.Item>
      }
    </Menu.Menu>
  );

};

export default Login;

