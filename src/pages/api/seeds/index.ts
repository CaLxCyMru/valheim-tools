import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { In, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { ApiError } from '../../../enums';
import { SeedAsset } from '../../../models';
import { SeedOverview } from '../../../models/seeds/seed-overview.model';
import { ISeed, Seed } from '../../../models/seeds/seed.model';
import { Session } from '../../../types';
import { error, parseNumber, success } from '../../../utils';
import { getRepo } from '../lib';
import { decode, encode } from 'base-64';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { cursor, pageSize },
  } = req;

  let parsedCursor: { [key: string]: number };

  if (cursor) {
    try {
      parsedCursor = JSON.parse(decode(cursor as string));
    } catch (ex) {
      parsedCursor = undefined;
    }

    if (!parsedCursor) {
      error(res, 'Invalid Cursor', ApiError.BAD_REQUEST);
      return;
    }
  } else {
    parsedCursor = { page: 0, size: parseNumber(pageSize as string) ?? 1 };
  }

  const { page, size } = parsedCursor;

  if (page < 0) {
    error(res, 'Page cannot be less than 0', ApiError.BAD_REQUEST);
    return;
  }

  if (size < 0) {
    error(res, 'Page Size cannot be less than 0', ApiError.BAD_REQUEST);
    return;
  }

  const skip = page * size;

  const seedRepo = await getRepo(Seed);
  const [data, total] = await seedRepo.findAndCount({
    skip,
    order: { created: 'DESC' },
    take: size,
    cache: 60000,
  });

  if (data) {
    const overviewRepo = await getRepo<SeedOverview>(SeedOverview);
    const overviews = await overviewRepo.find({ where: { seedId: In(data.map(({ id }) => id)) } });
    data.map((seed) => {
      seed.overview = overviews.find((a) => a.seedId === seed.id);
    });
  }

  const next = { page: total > skip + size ? page + 1 : null, size };

  success(res, data, {
    total,
    next: encode(JSON.stringify(next)),
  });
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

  error(
    res,
    `Seed '${seed}' already exists. Please submit a unique seed.`,
    ApiError.SEED_ALREADY_EXISTS,
  );
  return true;
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = (await getSession({ req })) as Session;

  if (!session) {
    error(res, 'Unauthorized', ApiError.UNAUTHORIZED, undefined, 403);
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
    error(res, 'Validation Errors', ApiError.VALIDATION_FAILED, { validationErrors });
    return;
  }

  const result = await repo.save(parsed);
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
