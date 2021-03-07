import { plainToClass } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';
import React from 'react';
import {
  Button,
  Dropdown,
  DropdownItemProps,
  Form,
  Input,
  Message,
  TextArea,
} from 'semantic-ui-react';
import useSWR from 'swr';
import { PartialDeep } from 'type-fest';
import fetch from 'unfetch';
import { v4 as uuid } from 'uuid';
import { Dropzone, withAuth, withLayout } from '../../components';
import { SeedAssetType } from '../../enums';
import { ISeed, ISeedAsset, ISeedTag, Seed } from '../../models';
import styles from '../../styles/pages/CreateSeed.module.scss';
import { ApiResponse } from '../../types';
import { capitalize, parseApiError } from '../../utils';

const CreateSeed = () => {
  const { data: tags } = useSWR<ApiResponse<ISeedTag[]>>('/api/seeds/tags', { refreshInterval: 0 });
  const [formData, setFormData] = React.useState<PartialDeep<ISeed>>({});
  const [previewAsset, setPreviewAsset] = React.useState(undefined);
  const [seedTags, setSeedTags] = React.useState<Partial<ISeedTag[]>>(undefined);
  const [validationErrors, setValidationErrors] = React.useState<ValidationError[]>(undefined);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<{ title: string; message: string }>(undefined);
  const [submissions, setSubmissions] = React.useState(0);

  const hasValidSeed = () => {
    const { seed, description, title } = formData || {};
    return seed && description && title && previewAsset && validationErrors?.length === 0;
  };

  const validateForm = () => {
    const { seed, title, description } = formData;

    const parsed = plainToClass<PartialDeep<Seed>, PartialDeep<ISeed>>(Seed, {
      seed: seed ?? undefined,
      title: title ?? undefined,
      description: description ?? undefined,
    });

    setValidationErrors(validateSync(parsed, { skipUndefinedProperties: true }));
  };

  const onFormChange = (_e: unknown, { name, value }) => {
    setFormData({ ...formData, [name]: value });
    validateForm();
  };

  const uploadAsset = async (file, type: SeedAssetType): Promise<ISeedAsset> => {
    if (!hasValidSeed()) {
      return;
    }

    if (!file) {
      throw new Error('File is not defined');
    }

    const { seed } = formData;

    const id = uuid();
    const { type: fileType } = file;

    const res = await fetch(`/api/seeds/assets?id=${id}&type=${fileType}&seed=${seed}`, {
      method: 'POST',
    });

    const { data, error } = await res.json();

    if (error) {
      const parsedError = parseApiError(error);
      setSuccess(false);
      setError(parsedError);
      return;
    }

    const { url, path } = data;

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

  const resetForm = () => {
    setFormData({});
    setPreviewAsset(undefined);
    setValidationErrors(undefined);
    setSeedTags(undefined);
    setSubmissions(submissions + 1);
  };

  const onSubmit = async () => {
    if (!hasValidSeed()) {
      const data = formData;

      setFormData({
        seed: data.seed ?? '',
        title: data.title ?? '',
        description: data.description ?? '',
      });

      validateForm();
      return;
    }

    // Upload assets
    const assets = await uploadAssets();

    const seed: PartialDeep<ISeed> = {
      ...formData,
      assets,
      tags: seedTags?.map(({ id }) => ({ id })),
    };

    // Now let's create our seed

    const response = await fetch('/api/seeds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(seed),
    });

    const { data, error } = await response.json();

    if (error || !data) {
      const parsedError = parseApiError(error);
      setSuccess(false);
      setError(parsedError);
      return;
    }

    if (data) {
      setError(undefined);
      setSuccess(true);
      resetForm();
    }
  };

  const tagOptions = (): DropdownItemProps[] =>
    tags?.data?.map(({ id, tag }) => ({ key: id, text: tag, value: id }));

  const onSetFiles = (files: File[]) => {
    if (files?.length) {
      setPreviewAsset(files[0]);
    }
  };

  const tagsChanged = (_e, { value }) => setSeedTags(value.map((id: string) => ({ id, value })));

  return (
    <div className={styles.createSeed}>
      <Form className={styles.form} onSubmit={onSubmit} error={error !== undefined}>
        <Form.Field
          control={Input}
          value={formData?.seed ?? ''}
          className={styles.input}
          required
          name="seed"
          label={'Seed'}
          placeholder="Seed"
          onChange={onFormChange}
          onFocus={validateForm}
          error={getValidationErrorForField('seed')}
        />
        <Form.Field
          control={Input}
          value={formData?.title ?? ''}
          className={styles.input}
          required
          name="title"
          label={'Title'}
          placeholder="Short title that explains the seed"
          onChange={onFormChange}
          onFocus={validateForm}
          error={getValidationErrorForField('title')}
        />
        <Form.Field
          control={TextArea}
          value={formData?.description ?? ''}
          className={styles.input}
          required
          name="description"
          label={'Description'}
          placeholder="Explain the seed in detail"
          onChange={onFormChange}
          onFocus={validateForm}
          error={getValidationErrorForField('description')}
        />
        <Form.Field>
          <Dropzone preview={true} resetCounter={submissions} setFiles={onSetFiles} />
        </Form.Field>
        <Form.Field>
          <Dropdown
            placeholder="Tags"
            onChange={tagsChanged}
            value={seedTags?.map(({ id }) => id) ?? []}
            fluid
            multiple
            selection
            options={tags ? tagOptions() : []}
          />
        </Form.Field>
        {(error || success) && (
          <Message
            error={error !== undefined}
            color={error ? 'red' : 'blue'}
            header={error ? error.title : 'Seed Uploaded'}
            content={error ? error.message : 'Seed has been uploaded successfully'}
          />
        )}
        <Form.Field
          className={styles.submit}
          disabled={!hasValidSeed()}
          control={Button}
          type="submit"
        >
          Submit
        </Form.Field>
      </Form>
    </div>
  );
};

export default withAuth(withLayout(CreateSeed));
