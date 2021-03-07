import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiError } from '../../../../enums';
import { error, parseQueryString, success } from '../../../../utils';
import { SeedService } from './../../lib/services/seed.service';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { seed },
  } = req;

  if (!seed) {
    error(res, 'Missing Fields', ApiError.BAD_REQUEST, { missingFields: ['seed'] });
    return;
  }

  const data = await SeedService.instance.findBySeed(res, parseQueryString(seed));
  success(res, data);
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  switch (req.method) {
    case 'GET':
      await get(req, res);
      return;
    default:
      error(res, 'Method not allowed', ApiError.METHOD_NOT_ALLOWED, undefined, 405);
      return;
  }
};
