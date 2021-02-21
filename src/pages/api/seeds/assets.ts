import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import mime from 'mime-types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { error } from '../../../utils';
import { getRepo } from '../lib/seeds-db';
import { checkExists } from './index';

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

  if (!id) {
    error(res, 'Id not provided');
    return;
  }

  if (!type) {
    error(res, 'Type not provided');
    return;
  }

  const contentType = mime.contentType(type);

  if (!contentType) {
    error(res, 'Invalid content type');
    return;
  }

  if (!seed) {
    error(res, 'Seed not provided');
    return;
  }

  const repo = await getRepo();

  if (await checkExists(seed, res, repo)) {
    return;
  }

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
  res.status(200).json({ path, contentType, url: response });
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  console.log(req.method);
  switch (req.method) {
    case 'POST':
      await post(req, res);
      break;
    default:
      res.status(405).end(); // Method Not Allowed
      break;
  }
};
