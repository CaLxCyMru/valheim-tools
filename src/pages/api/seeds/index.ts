import { Repository } from 'typeorm';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getRepo } from '../lib/seeds-db';
import { Seed } from '../../../models/seeds/seed.model';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const repo = await getRepo();
  const data = await repo.find({ cache: 60000 });

  res.status(200).json(data);
};

const checkExists = async (
  seed: string,
  res: NextApiResponse,
  repo: Repository<Seed>,
): Promise<boolean> => {
  const existing = await repo.findOne({
    where: {
      seed,
    },
  });

  if (!existing) {
    return false;
  }

  res.status(400);
  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      error: 'Seed already exists',
    }),
  );
  return true;
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const repo = await getRepo();

  const toCreate = req.body;

  const { seed } = toCreate;

  // Check to see if we already have the seed
  if (await checkExists(seed, res, repo)) {
    return;
  }

  res.status(200).end();
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
      res.status(405).end(); // Method Not Allowed
      break;
  }
};
