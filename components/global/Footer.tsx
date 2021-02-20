import React from 'react';
import { Container, Icon, Segment } from 'semantic-ui-react';
import styles from '../../styles/components/global/Footer.module.scss';

// type FooterProps = {

// };

const Footer = () => (
  <Segment inverted vertical className={`${styles.footer}`}>
    <Container>
      &copy; {new Date().getUTCFullYear()} Valheim Tools. Not Affiliated with Valheim/Iron Gate
      Studios
      <a
        className={styles.github}
        href="https://github.com/calxcymru/valheim-tools"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon name="github" /> MIT on GitHub 🚀
      </a>
    </Container>
  </Segment>
);

export default Footer;
