import { DateTime, ToRelativeCalendarOptions } from 'luxon';
import React from 'react';
import { Card, Placeholder } from 'semantic-ui-react';
import { AuthUser } from '../../models';
import { ISeed } from '../../models/seeds/seed.model';
import { Loadable } from '../../types';

const SeedPostedBy = ({
  created,
  createdBy,
  loading,
}: Pick<ISeed, 'created' | 'createdBy'> & Loadable): JSX.Element => {
  const getPostedDuration = () => {
    const createdDate: DateTime =
      typeof created === 'string' ? DateTime.fromISO(created) : undefined;

    if (!createdDate) {
      return undefined;
    }

    const base = DateTime.now();
    const diff = base.diff(createdDate);

    const options: ToRelativeCalendarOptions = { base };

    const diffAsSeconds = diff.as('seconds');

    if (diffAsSeconds <= 20) {
      return 'a few seconds ago';
    }

    if (diffAsSeconds < 60) {
      options.unit = 'seconds';
    } else if (diff.as('minutes') < 60) {
      options.unit = 'minutes';
    } else if (diff.as('hours') < 24) {
      options.unit = 'hours';
    }

    return createdDate.toRelativeCalendar(options);
  };

  const loader = () => (
    <Placeholder>
      <Placeholder.Line length="short" />
    </Placeholder>
  );

  const render = () => {
    if (loading) {
      return loader();
    }

    return (
      <>
        Posted {getPostedDuration()} by {(createdBy as AuthUser)?.name}
      </>
    );
  };

  return (
    <Card.Content extra>
      <Card.Meta
        style={loading ? { marginBottom: '10px', marginTop: '0' } : { marginBottom: '5px' }}
      >
        {render()}
      </Card.Meta>
    </Card.Content>
  );
};

export default SeedPostedBy;
