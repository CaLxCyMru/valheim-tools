import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiError } from '../../../../enums';
import { error, success } from '../../../../utils';
import { SeedService } from './../../lib/services/seed.service';

const get = async (_req: NextApiRequest, res: NextApiResponse) => {
  const data = await SeedService.instance.getAllTags();

  success(res, data);
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  switch (req.method) {
    case 'GET':
      await get(req, res);
      break;
    default:
      error(res, 'Method not allowed', ApiError.METHOD_NOT_ALLOWED, undefined, 405);
      break;
  }
};
