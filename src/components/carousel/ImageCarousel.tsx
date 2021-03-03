import React from 'react';
import { Image, ImageProps } from 'semantic-ui-react';
import Carousel, { CarouselProps } from './Carousel';

export type ImageCarouselProps = CarouselProps<string | ImageProps>;

const ImageCarousel = ({ slides, ...props }: ImageCarouselProps): JSX.Element => {
  return (
    <Carousel
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
      {...props}
    />
  );
};

export default ImageCarousel;
