import { Slide } from 'pure-react-carousel';
import React from 'react';
import { Card, CardProps } from 'semantic-ui-react';
import styles from '../../styles/components/carousel/CardSlide.module.scss';

export type CardSlideProps = {
  index: number;
} & CardProps;

const CardSlide = ({ index, ...cardProps }: CardSlideProps): JSX.Element => (
  <Slide className={styles.cardSlide} index={index}>
    <div className={styles.cardWrapper}>
      <Card fluid {...cardProps} />
    </div>
  </Slide>
);

export default CardSlide;
