import type { NextApiRequest, NextApiResponse } from 'next';
import { DateTime } from 'luxon';
import { Seed } from '../../../models/seeds/seed.model';
import { createConnection } from '../lib/seeds-db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('Seeds endpoint hit ', DateTime.now().toISO());

  const connection = await createConnection();
  console.log('Got Seed DB connection', DateTime.now().toISO());

  const repo = connection.getRepository(Seed);

  console.log('Got Seed Repo', DateTime.now().toISO());

  const data = await repo.find({ cache: 60000 });

  console.log('Found Data', DateTime.now().toISO());

  // console.log(data);

  res.status(200).json(data);

  console.log('Returned response', DateTime.now().toISO());
};
