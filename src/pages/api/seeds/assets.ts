import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import mime from 'mime-types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiError } from '../../../enums';
import { error, success } from '../../../utils';
import { SeedService } from './../lib/services/seed.service';

let storage: Storage = undefined;

const getStorage = () => {
  if (storage) {
    return storage;
  }

  storage = new Storage({
    projectId: process.env.STORAGE_PROJECT_ID,
    credentials: {
      client_email: process.env.STORAGE_CLIENT_EMAIL,
      private_key: process.env.STORAGE_PRIVATE_KEY,
    },
  });

  return storage;
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, type, seed } = req.query as { [key: string]: string };

  const missingFields = [];

  if (!id) {
    missingFields.push('id');
  }

  if (!type) {
    missingFields.push('type');
  }

  if (!seed) {
    missingFields.push(seed);
  }

  if (missingFields.length) {
    error(res, 'Missing Fields', ApiError.BAD_REQUEST, { missingFields });
    return;
  }

  const contentType = mime.contentType(type);

  if (!contentType) {
    error(res, 'Invalid Content Type', ApiError.INVALID_CONTENT_TYPE, { type });
    return;
  }

  await SeedService.instance.errorIfExists(seed, res);

  const storage = getStorage();
  const bucket = storage.bucket(process.env.STORAGE_BUCKET_NAME);
  const path = `${seed}/${id}.${mime.extension(contentType)}`;
  const asset = bucket.file(path);

  const options: GetSignedUrlConfig = {
    contentType,
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };

  const [response] = await asset.getSignedUrl(options);
  success(res, { path, contentType, url: response });
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  console.log(req.method);
  switch (req.method) {
    case 'POST':
      await post(req, res);
      break;
    default:
      error(res, 'Method not allowed', ApiError.METHOD_NOT_ALLOWED, undefined, 405);
      break;
  }
};
