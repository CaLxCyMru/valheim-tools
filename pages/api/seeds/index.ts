import { Seed } from './../../../models/seeds/seed.model';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createConnection } from '../lib/seeds-db';
import { getSession } from 'next-auth/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const connection = await createConnection();
  const repo = connection.getRepository(Seed);
  const data = await repo.find({ cache: 60000 });
  res.status(200).json(data);
};
