import React from 'react';
import { CardContentProps } from 'semantic-ui-react';
import CardSlide from './CardSlide';
import Carousel, { CarouselProps } from './Carousel';

export type CardCarouselProps = CarouselProps<CardContentProps>;

const CardCarousel = ({ slides, ...props }: CardCarouselProps): JSX.Element => {
  return (
    <Carousel
      slides={slides.map((slide, index) => (
        <CardSlide key={`card-slide-${index}`} index={index} {...slide} />
      ))}
      {...props}
    />
  );
};

export default CardCarousel;
