import React, { SyntheticEvent } from 'react';
import useClipboard from 'react-use-clipboard';
import { Button, Icon, Label, Popup } from 'semantic-ui-react';
import { ISeed } from '../../models/seeds/seed.model';
import { Loadable } from '../../types';

const SeedCopy = ({ seed, loading }: Pick<ISeed, 'seed'> & Loadable): JSX.Element => {
  const [isSeedCopied, setSeedCopied] = useClipboard(seed, {
    successDuration: 1000,
  });

  const copy = (e: SyntheticEvent) => {
    e?.preventDefault();
    setSeedCopied();
  };

  return (
    <Popup
      content="Seed Copied"
      open={isSeedCopied}
      trigger={
        <Button disabled={loading} as="div" labelPosition="right" onClick={copy} floated="right">
          <Button disabled={loading}>Copy</Button>
          <Label>
            <Icon name="clipboard" />
          </Label>
        </Button>
      }
    />
  );
};

export default SeedCopy;
