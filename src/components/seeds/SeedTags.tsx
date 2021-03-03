import React from 'react';
import { Card, Label, Placeholder } from 'semantic-ui-react';
import { ISeed } from '../../models/seeds/seed.model';
import { Loadable } from '../../types';

const SeedMeta = ({ tags, loading }: Pick<ISeed, 'tags'> & Loadable): JSX.Element => {
  const loader = () => (
    <Placeholder>
      <Placeholder.Paragraph>
        <Placeholder.Line length="short" />
      </Placeholder.Paragraph>
    </Placeholder>
  );

  const render = () => {
    return (
      <Card.Content>
        <Label.Group circular>
          {loading ? (
            loader()
          ) : (
            <> {tags && tags.map(({ id, tag }) => <Label key={id}>{`#${tag}`}</Label>)}</>
          )}
        </Label.Group>
      </Card.Content>
    );
  };

  return render();
};

export default SeedMeta;
