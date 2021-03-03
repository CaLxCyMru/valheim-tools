import { CarouselProvider, Slide, Slider } from 'pure-react-carousel';
import React from 'react';
import styles from '../../styles/components/carousel/Carousel.module.scss';
import DotGroup from './DotGroup';

type ElementFunction = () => JSX.Element;

export interface CarouselProps<T = JSX.Element | ElementFunction> {
  className?: string;
  slides: T[];
  width?: number;
  height?: number;
  interval?: number;
  infinite?: boolean;
  isIntrinsicHeight?: boolean;
  hideDots?: boolean;
  dragEnabled?: boolean;
  touchEnabled?: boolean;
  isPlaying?: boolean;
}

const Carousel = ({
  className,
  slides,
  width,
  height,
  interval,
  infinite,
  isIntrinsicHeight,
  hideDots,
  dragEnabled,
  touchEnabled,
  isPlaying,
}: CarouselProps): JSX.Element => {
  const count = slides.length;

  const renderSlide = (slide) => {
    if (typeof slide === 'function') {
      return slide();
    }
    return slide;
  };

  if (count === 1) {
    const first = slides[0];
    return renderSlide(first);
  }

  return (
    <CarouselProvider
      className={`${styles.carousel} ${className ? className : ''}`}
      naturalSlideWidth={width ?? undefined}
      naturalSlideHeight={height ?? undefined}
      totalSlides={count}
      interval={interval}
      infinite={infinite}
      isIntrinsicHeight={isIntrinsicHeight ?? true}
      dragEnabled={dragEnabled ?? false}
      touchEnabled={touchEnabled}
      isPlaying={isPlaying}
    >
      <Slider>
        {slides.map((slide, index) => (
          <Slide index={index} key={`slide=${index}`}>
            {renderSlide(slide)}
          </Slide>
        ))}
      </Slider>
      {count > 1 && !hideDots && <DotGroup slides={count} />}
    </CarouselProvider>
  );
};

export default Carousel;
