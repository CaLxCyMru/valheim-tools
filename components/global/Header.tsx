import { signIn, signOut, useSession } from 'next-auth/client';
import React from 'react';
import { Loader, Menu } from 'semantic-ui-react';
import styles from '../../styles/components/global/Header.module.scss';

type HeaderProps = {

};

const Header = (props: HeaderProps) => {
  const [activeItem, setActiveItem] = React.useState('home');

  const handleItemClick = (event, { name }) => {
    setActiveItem(name);
  };

  const [session, loading] = useSession();

  const loader = <Loader active size='tiny' />;

  return (
    <div className={styles.header}>
      <Menu pointing secondary>
        <Menu.Item
          className={'item'}
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

        <Menu.Menu position='right'>

          {!session &&
            <Menu.Item
              name='login'
              active={activeItem === 'login'}
              onClick={() => signIn()}
            >
              {loading ? loader : <>Log In</>}
            </Menu.Item>
          }

          {session &&
            <Menu.Item
              name='logout'
              active={activeItem === 'logout'}
              onClick={() => signOut()}
            >
              {loading ? loader : <>Log out of {session.user.email}</>}
            </Menu.Item>
          }
        </Menu.Menu>
      </Menu>
    </div>
  );

};

export default Header;

