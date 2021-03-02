import React from 'react';
import { CardContentProps } from 'semantic-ui-react';
import CardSlide from './CardSlide';
import Carousel from './Carousel';

export interface CardCarouselProps {
  slides: CardContentProps[];
  width?: number;
  height?: number;
}

const CardCarousel = ({ slides, width, height }: CardCarouselProps): JSX.Element => {
  return (
    <Carousel
      slides={slides.map((slide, index) => (
        <CardSlide key={`card-slide-${index}`} index={index} {...slide} />
      ))}
      width={width}
      height={height}
    />
  );
};

export default CardCarousel;
