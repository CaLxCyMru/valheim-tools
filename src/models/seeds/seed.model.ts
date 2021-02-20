import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Dates, IDates } from '../common/dates.model';
import { ISeedAsset, SeedAsset } from './seed-asset.model';
import { ISeedStatistic, SeedStatistic } from './seed-statistic.model';
import { AuthUser, IAuthUser } from '../auth-user';

export interface ISeed extends IDates {
  id: string;
  seed: string;
  description: string;
  tags?: string[];
  statistics: ISeedStatistic;
  assets: ISeedAsset[];
  createdBy: IAuthUser;
}

@Entity()
export class Seed extends Dates implements ISeed {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({ unique: true })
  public readonly seed: string;

  @Column()
  public readonly description: string;

  @Column('simple-array', { nullable: true })
  public readonly tags?: string[];

  @OneToOne(() => SeedStatistic, { eager: true })
  @JoinColumn()
  public readonly statistics: SeedStatistic;

  @OneToMany('SeedAsset', 'seed', { eager: true })
  public readonly assets: SeedAsset[];

  @ManyToOne('AuthUser', 'seeds', { eager: true })
  public readonly createdBy: AuthUser;
}
