import React from 'react';
import { Menu } from 'semantic-ui-react';
import styles from '../../styles/components/global/Header.module.scss';
import Login from './Login';

type HeaderProps = {

};

const Header = (props: HeaderProps) => {
  const [activeItem, setActiveItem] = React.useState('home');

  const handleItemClick = (event, { name }) => {
    setActiveItem(name);
  };

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

        <Login />
      </Menu>
    </div>
  );

};

export default Header;

