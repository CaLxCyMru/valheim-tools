import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
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
import { ISeed, ISeedAsset, ISeedTag, Seed } from '../../models';
import styles from '../../styles/pages/CreateSeed.module.scss';
import { capitalize } from '../../utils';

const CreateSeed = () => {
  const { data: tags } = useSWR<ISeedTag[]>('/api/seeds/tags');
  const [validated, setValidated] = React.useState(undefined);
  const [formData, setFormData] = React.useState<Partial<ISeed>>({});
  const [previewAsset, setPreviewAsset] = React.useState(undefined);
  const [seedTags, setSeedTags] = React.useState<[]>(undefined);
  const [validationErrors, setValidationErrors] = React.useState<ValidationError[]>(undefined);

  const validateForm = async () => {
    const { seed, title, description } = formData;
    const parsed = plainToClass<Partial<Seed>, Partial<ISeed>>(Seed, {
      seed: seed ?? undefined,
      title: title ?? undefined,
      description: description ?? undefined,
      assets: previewAsset ? [previewAsset] : undefined,
    });

    setValidationErrors(await validate(parsed, { skipUndefinedProperties: true }));
    console.log(validationErrors);
  };

  const onFormChange = (_e: unknown, { name, value }) => {
    setFormData({ ...formData, [name]: value });
    validateForm();
  };

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

  const getValidationErrorForField = (field: string): string | undefined => {
    const validationError = validationErrors?.find(
      ({ property, constraints }) =>
        field === property && constraints && Object.keys(constraints).length,
    );

    if (!validationError) {
      return undefined;
    }

    return capitalize(Object.values(validationError.constraints)[0]);
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
    if (data?.data && !data?.error) {
      alert('Uploaded Seed');
      setFormData({});
      setPreviewAsset(undefined);
      setValidated(undefined);
      setSeedTags(undefined);
      return;
    }
    alert(data);
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
          error={getValidationErrorForField('seed')}
        />
        <Form.Field
          control={Input}
          className={styles.input}
          required
          name="title"
          label={'Title'}
          placeholder="Short title that explains the seed"
          onChange={onFormChange}
          error={getValidationErrorForField('title')}
        />
        <Form.Field
          control={TextArea}
          className={styles.input}
          required
          name="description"
          label={'Description'}
          placeholder="Explain the seed in detail"
          onChange={onFormChange}
          error={getValidationErrorForField('description')}
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
          error={getValidationErrorForField('assets')}
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
      {JSON.stringify(validationErrors)}
    </div>
  );
};

export default withAuth(withLayout(CreateSeed));
