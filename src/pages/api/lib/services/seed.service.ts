import { decode, encode } from 'base-64';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextApiResponse } from 'next';
import { In, Repository } from 'typeorm';
import { ApiError } from '../../../../enums';
import { ISeed, Seed, SeedAsset, SeedOverview, SeedTag } from '../../../../models';
import { error } from '../../../../utils';
import { SeedStatistic } from './../../../../models/seeds/seed-statistic.model';
import { SeedDatabase } from './../database/seed.database';
import { AuthService } from './auth.service';

export class SeedService {
  private static _instance: SeedService;
  public constructor(private readonly database: SeedDatabase) {}

  public static get instance(): SeedService {
    if (!SeedService._instance) {
      SeedService._instance = new SeedService(SeedDatabase.instance);
    }
    return SeedService._instance;
  }

  public async getSeedsByCursor(
    res: NextApiResponse,
    cursor?: string,
    pageSize = 10,
  ): Promise<{ data: Seed[]; meta: { total: number; next: string } }> {
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
      parsedCursor = { page: 0, size: pageSize };
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

    const seedRepo = await this.database.getRepo(Seed);
    const [data, total] = await seedRepo.findAndCount({
      skip,
      order: { created: 'DESC' },
      take: size,
      cache: 60000,
    });

    if (data && total > 0) {
      const overviewRepo = await this.database.getRepo(SeedOverview);
      const overviews = await overviewRepo.find({
        where: { seedId: In(data.map(({ id }) => id)) },
      });

      data.map((seed) => {
        seed.overview = overviews.find((a) => a.seedId === seed.id);
      });
    }

    const next = { page: total > skip + size ? page + 1 : null, size };

    return {
      data,
      meta: {
        total,
        next: encode(JSON.stringify(next)),
      },
    };
  }

  public async create(toCreate: Partial<ISeed>, res: NextApiResponse): Promise<Seed> {
    const repo = await this.database.getRepo(Seed);

    const { seed } = toCreate;

    await this.errorIfExists(seed, res, repo);

    const parsed = plainToClass(Seed, {
      ...toCreate,
      assets: plainToClass(SeedAsset, toCreate.assets),
    });

    const validationErrors = await validate(parsed);

    if (validationErrors?.length > 0) {
      error(res, 'Validation Errors', ApiError.VALIDATION_FAILED, { validationErrors });
      return;
    }

    return await repo.save(parsed);
  }

  public async exists(seed: string, existingRepo?: Repository<Seed>): Promise<boolean> {
    const repo = existingRepo ?? (await this.database.getRepo(Seed));
    const count = await repo.count({
      where: { seed },
      cache: 60000,
    });
    return count > 0;
  }

  public async errorIfExists(
    seed: string,
    res: NextApiResponse,
    repo?: Repository<Seed>,
  ): Promise<boolean> {
    const exists = await this.exists(seed, repo);

    if (!exists) {
      return;
    }

    error(
      res,
      `Seed '${seed}' already exists. Please submit a unique seed.`,
      ApiError.SEED_ALREADY_EXISTS,
    );
  }

  public async findBySeed(res: NextApiResponse, seed: string): Promise<Seed> {
    const repo = await this.database.getRepo(Seed);
    const data = await repo.findOne({
      where: { seed },
      cache: 60000,
    });

    if (!data) {
      error(res, 'Seed does not exist', ApiError.RESOURCE_NOT_FOUND);
      return;
    }

    return data;
  }

  public async getAllTags(): Promise<SeedTag[]> {
    const repo = await this.database.getRepo(SeedTag);
    return await repo.find({ cache: 60000 });
  }

  public async like(seed: Seed, userId: string | number): Promise<SeedStatistic> {
    const user = await AuthService.instance.find(userId);
    const repo = await this.database.getRepo(SeedStatistic);
    const data = await repo.save({ liked: true, seed, user });
    return data;
  }

  public async unlike(seedStatisticId: string): Promise<boolean> {
    const repo = await this.database.getRepo(SeedStatistic);
    try {
      const { affected } = await repo.update(seedStatisticId, { liked: false });
      return affected > 0;
    } catch {
      return false;
    }
  }

  public async hasLiked(seed: Seed, userId: string | number): Promise<boolean> {
    const repo = await this.database.getRepo(SeedStatistic);
    const count = await repo.count({ where: { seed, user: { id: userId }, liked: true } });
    return count > 0;
  }
}
