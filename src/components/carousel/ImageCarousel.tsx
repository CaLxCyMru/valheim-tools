import { Slide } from 'pure-react-carousel';
import React from 'react';
import { Image, ImageProps } from 'semantic-ui-react';
import Carousel from './Carousel';

export interface ImageCarouselProps {
  className?: string;
  slides: (string | ImageProps)[];
  width?: number;
  height?: number;
}

const ImageCarousel = ({ className, slides, width, height }: ImageCarouselProps): JSX.Element => {
  return (
    <Carousel
      className={className}
      slides={slides.map((slide, index) => {
        const key = `image-slide-${index}`;
        const image =
          typeof slide === 'string' ? (
            <Image key={key} src={slide} />
          ) : (
            <Image key={key} {...slide} />
          );

        return image;
      })}
      width={width}
      height={height}
    />
  );
};

export default ImageCarousel;
