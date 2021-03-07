import React, { useCallback } from 'react';
import {
  DropEvent,
  DropzoneProps as ReactDropzoneProps,
  FileRejection,
  useDropzone,
} from 'react-dropzone';
import { Icon, Label, Segment } from 'semantic-ui-react';
import styles from '../../styles/components/dropzone/Dropzone.module.scss';

export interface DropzoneProps extends ReactDropzoneProps {
  setFiles?: (files: File[], fileRejections?: FileRejection[], event?: DropEvent) => void;
  resetCounter?: number;
  preview?: boolean;
}

const dropzone = ({ setFiles, preview, resetCounter, ...props }: DropzoneProps): JSX.Element => {
  const [selectedFiles, setSelectedFiles] = React.useState(undefined);
  const [previewImages, setPreviewImages] = React.useState([]);

  React.useEffect(() => {
    setSelectedFiles(undefined);
    setPreviewImages([]);
  }, [resetCounter]);

  const onDrop = useCallback((files: File[], rejections: FileRejection[], event: DropEvent) => {
    setSelectedFiles(files);

    if (setFiles) {
      setFiles(files, rejections, event);
    }

    if (preview) {
      setPreviewImages(
        files.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      );
    }

    const { onDrop } = props;

    if (onDrop) {
      onDrop(files, rejections, event);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxFiles: 1,
    ...props,
  });

  const previews = previewImages.map(
    (file): JSX.Element => (
      <div className={styles.preview} key={file.name}>
        <div className={styles.thumbnailContainer}>
          <img className={styles.thumbnail} alt={file.name} src={file.preview} />
        </div>
      </div>
    ),
  );

  // Make sure to revoke the data uris to avoid memory leaks
  React.useEffect(() => {
    previewImages.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [previewImages]);

  return (
    <div className={styles.dropzone} {...getRootProps()}>
      <input className={styles.input} {...getInputProps()} />
      <Segment className={`${styles.labelContainer} ${isDragActive ? styles.dragActive : ''}`}>
        <Label className={styles.label}>
          <Icon name="file" />
          {isDragActive ? 'Drop files here' : 'Drag and drop files here, or click to select'}
        </Label>
      </Segment>
      {!preview && selectedFiles?.length && (
        <Segment>
          {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
        </Segment>
      )}
      {preview && previews?.length > 0 && (
        <Segment className={styles.previews}>
          <>{previews}</>
        </Segment>
      )}
    </div>
  );
};

export default dropzone;
