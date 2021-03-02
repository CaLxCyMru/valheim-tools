import { Dot } from 'pure-react-carousel';
import React, { SyntheticEvent } from 'react';
import {
  Button,
  Container,
  IconProps,
  SemanticShorthandItem,
  SemanticSIZES,
  SemanticTEXTALIGNMENTS,
} from 'semantic-ui-react';

export type DotGroupProps = {
  slides: number;
  size?: SemanticSIZES;
  icon?: SemanticShorthandItem<IconProps>;
  align?: SemanticTEXTALIGNMENTS;
};

const DotGroup = ({ slides, size, icon, align }: DotGroupProps): JSX.Element => {
  const onClick = (e: SyntheticEvent) => e?.preventDefault();

  return (
    <Container textAlign={align ?? 'center'}>
      <Button.Group size={size ?? 'mini'} onClick={onClick}>
        {[...Array(slides).keys()].map((slide) => (
          <Button as={Dot} key={slide} icon={icon ?? 'circle'} onClick={onClick} slide={slide} />
        ))}
      </Button.Group>
    </Container>
  );
};

export default DotGroup;
