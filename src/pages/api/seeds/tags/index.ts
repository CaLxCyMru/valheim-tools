import type { NextApiRequest, NextApiResponse } from 'next';
import { SeedTag } from '../../../../models';
import { getRepo } from '../../lib';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const seedTagRepo = await getRepo<SeedTag>(SeedTag);
  const data = await seedTagRepo.find({ cache: 60000 });

  res.status(200).json(data);
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  switch (req.method) {
    case 'GET':
      await get(req, res);
      break;
    default:
      res.status(405).end(); // Method Not Allowed
      break;
  }
};
