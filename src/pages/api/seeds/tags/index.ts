import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiError } from '../../../../enums';
import { SeedTag } from '../../../../models';
import { error, success } from '../../../../utils';
import { getRepo } from '../../lib';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const seedTagRepo = await getRepo<SeedTag>(SeedTag);
  const data = await seedTagRepo.find({ cache: 60000 });

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
