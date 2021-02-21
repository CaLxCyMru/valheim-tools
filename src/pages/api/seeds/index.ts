import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { validate } from 'class-validator';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { In, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { SeedAsset } from '../../../models';
import { SeedOverview } from '../../../models/seeds/seed-overview.model';
import { ISeed, Seed } from '../../../models/seeds/seed.model';
import { Session } from '../../../types';
import { error, success } from '../../../utils';
import { getRepo } from '../lib/seeds-db';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const seedRepo = await getRepo(Seed);
  const data = await seedRepo.find({ cache: 60000 });

  if (data) {
    const overviewRepo = await getRepo<SeedOverview>(SeedOverview);
    const overviews = await overviewRepo.find({ where: { seedId: In(data.map(({ id }) => id)) } });
    data.map((seed) => {
      seed.overview = overviews.find((a) => a.seedId === seed.id);
    });
  }

  res.status(200).json(data);
};

export const checkExists = async (
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

  error(res, 'Seed already exists');
  return true;
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = (await getSession({ req })) as Session;

  if (!session) {
    error(res, 'Unauthorized', undefined, 403);
    return;
  }

  const repo = await getRepo();

  const toCreate: Partial<ISeed> = req.body;

  const { seed } = toCreate;

  // Check to see if we already have the seed
  if (await checkExists(seed, res, repo)) {
    return;
  }

  // If not supplied, let's generate a id for our seed
  if (!toCreate.id) {
    toCreate.id = uuid();
  }

  toCreate.createdBy = session.user.id;

  const parsed = plainToClass(Seed, {
    ...toCreate,
    assets: plainToClass(SeedAsset, toCreate.assets),
  });

  const validationErrors = await validate(parsed);

  if (validationErrors?.length > 0) {
    error(res, 'Validation Errors', { validationErrors });
    return;
  }

  const result = await repo.save(parsed);
  success(res, 'Seed added', { result });
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
