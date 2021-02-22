import React from 'react';
import {
  Button,
  Dropdown,
  DropdownItemProps,
  Form,
  Icon,
  Input,
  TextArea,
} from 'semantic-ui-react';
import useSWR from 'swr';
import fetch from 'unfetch';
import { v4 as uuid } from 'uuid';
import { withAuth, withLayout } from '../../components';
import { SeedAssetType } from '../../enums';
import { ISeed, ISeedAsset, ISeedTag } from '../../models';
import styles from '../../styles/pages/CreateSeed.module.scss';

const CreateSeed = () => {
  const { data: tags } = useSWR<ISeedTag[]>('/api/seeds/tags');
  const [validated, setValidated] = React.useState(undefined);
  const [formData, setFormData] = React.useState<Partial<ISeed>>({});
  const [previewAsset, setPreviewAsset] = React.useState(undefined);
  const [seedTags, setSeedTags] = React.useState<[]>(undefined);

  const onFormChange = (_e: unknown, { name, value }) =>
    setFormData({ ...formData, [name]: value });

  const uploadAsset = async (file, type: SeedAssetType): Promise<ISeedAsset> => {
    const { seed } = formData;

    if (!seed) {
      throw new Error('Seed is not defined');
    }

    const id = uuid();
    const { type: fileType } = file;

    const res = await fetch(`/api/seeds/assets?id=${id}&type=${fileType}&seed=${seed}`, {
      method: 'POST',
    });

    const { url, path } = await res.json();

    const uploadedAsset = await fetch(url, {
      method: 'PUT',
      body: file,
    });

    if (uploadedAsset.ok) {
      console.log('Uploaded successfully!');
    } else {
      console.error('Upload failed.');
    }

    return { id, type, path };
  };

  const uploadAssets = async (): Promise<ISeedAsset[]> => {
    const preview = await uploadAsset(previewAsset, SeedAssetType.PREVIEW);
    return [preview];
  };

  const onSubmit = async () => {
    if (!formData?.seed || !formData?.description) {
      setValidated(false);
      return;
    }

    setValidated(true);

    // Upload assets
    const assets = await uploadAssets();

    console.log(assets);

    const seed: Partial<ISeed> = {
      ...formData,
      assets,
      tags: seedTags,
    };

    // Now let's create our seed

    const response = await fetch('/api/seeds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(seed),
    });

    const data = await response.json();
    console.log(data);
    if (data) {
      alert('Uploaded');
      setFormData({});
      setPreviewAsset(undefined);
      setValidated(undefined);
      setSeedTags(undefined);
    }
  };

  const tagOptions = (): DropdownItemProps[] =>
    tags.map(({ id, tag }) => ({ key: id, text: tag, value: id }));

  // TODO: Add type
  const fileChange = (e) => {
    setPreviewAsset(e.target.files[0]);
  };

  const tagsChanged = (e, { value }) => setSeedTags(value.map((id: string) => ({ id })));

  return (
    <div className={styles.createSeed}>
      <Form className={styles.form} onSubmit={onSubmit}>
        <Form.Field
          control={Input}
          className={styles.input}
          required
          name="seed"
          label={'Seed'}
          placeholder="Seed"
          onChange={onFormChange}
        />
        <Form.Field
          control={Input}
          className={styles.input}
          required
          name="title"
          label={'Title'}
          placeholder="Short title that explains the seed"
          onChange={onFormChange}
        />
        <Form.Field
          control={TextArea}
          className={styles.input}
          required
          name="description"
          label={'Description'}
          placeholder="Explain the seed in detail"
          onChange={onFormChange}
        />
        <Form.Field>
          <Button as="label" htmlFor="file" type="button" animated="fade">
            <Button.Content visible>
              <Icon name="file" />
            </Button.Content>
            <Button.Content hidden>Choose a File</Button.Content>
          </Button>
          <input type="file" id="file" hidden onChange={fileChange} />
        </Form.Field>
        <Form.Input
          fluid
          label="File Chosen: "
          placeholder="Use the above bar to browse your file system"
          readOnly
          value={previewAsset?.name ?? ''}
        />
        {tags && (
          <Dropdown
            placeholder="Tags"
            onChange={tagsChanged}
            fluid
            multiple
            selection
            options={tagOptions()}
          />
        )}
        <Form.Field control={Button} type="submit">
          Submit
        </Form.Field>
      </Form>
      {validated === false && <p>Please check the form as not all required fields are present </p>}
    </div>
  );
};

export default withAuth(withLayout(CreateSeed));
