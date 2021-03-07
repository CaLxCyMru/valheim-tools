import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiError } from '../../../../enums';
import { error, parseQueryString, success } from '../../../../utils';
import { AuthService } from '../../lib';
import { SeedService } from './../../lib/services/seed.service';

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await AuthService.instance.verifySession(req, res);
  const {
    query: { seed: suppliedSeed },
  } = req;

  if (!suppliedSeed) {
    error(res, 'Missing Fields', ApiError.BAD_REQUEST, { missingFields: ['seed'] });
    return;
  }

  const seed = await SeedService.instance.findBySeed(res, parseQueryString(suppliedSeed));

  const hasLiked = await SeedService.instance.hasLiked(seed, session.user.id);

  if (hasLiked) {
    error(res, 'You have already liked this seed', ApiError.SEED_ALREADY_LIKED, undefined, 400);
    return;
  }

  const data = SeedService.instance.like(seed, session.user.id);

  success(res, data);
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  switch (req.method) {
    case 'POST':
      await post(req, res);
      return;
    default:
      error(res, 'Method not allowed', ApiError.METHOD_NOT_ALLOWED, undefined, 405);
      return;
  }
};
