import React from 'react';
import { Icon } from 'semantic-ui-react';
import styles from '../../styles/components/global/Footer.module.scss';

type FooterProps = {

};

const Footer = (props: FooterProps) => {
  console.log(props);
  return <footer className={`${styles.footer}`}>
    <a
      href='https://github.com/calxcymru/valheim-tools'
      target='_blank'
      rel='noopener noreferrer'
    >
      <Icon name='github' />{' '}MIT on GitHub
    </a>
  </footer>;
};

export default Footer;

