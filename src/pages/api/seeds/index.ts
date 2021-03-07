import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuid } from 'uuid';
import { ApiError } from '../../../enums';
import { ISeed } from '../../../models/seeds/seed.model';
import { error, parseNumber, parseQueryString, success } from '../../../utils';
import { AuthService } from '../lib';
import { SeedService } from './../lib/services/seed.service';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { cursor, pageSize },
  } = req;

  const size = parseNumber(pageSize as string);

  const { data, meta } = await SeedService.instance.getSeedsByCursor(
    res,
    parseQueryString(cursor),
    size,
  );

  success(res, data, meta);
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await AuthService.instance.verifySession(req, res);
  const toCreate: Partial<ISeed> = req.body;

  // If not supplied, let's generate a id for our seed
  if (!toCreate.id) {
    toCreate.id = uuid();
  }

  toCreate.createdBy = session.user.id;

  const result = await SeedService.instance.create(toCreate, res);

  success(res, result, { result });
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  switch (req.method) {
    case 'GET':
      await get(req, res);
      break;
    case 'POST':
      await post(req, res);
      break;
    default:
      error(res, 'Method not allowed', ApiError.METHOD_NOT_ALLOWED, undefined, 405);
      break;
  }
};
