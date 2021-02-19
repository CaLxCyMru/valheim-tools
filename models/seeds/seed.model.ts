import { Dates, IDates } from '../common/dates.model';
import { ISeedAsset, SeedAsset } from './seed-asset.model';
import { ISeedStatistics, SeedStatistics } from './seed-statistics.model';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

export interface ISeed extends IDates {
  id: string;
  seed: string;
  description: string;
  tags?: string[];
  statistics: ISeedStatistics;
  assets: ISeedAsset[];
}

@Entity()
export class Seed extends Dates implements ISeed {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column()
  public readonly seed: string;

  @Column()
  public readonly description: string;

  @Column('simple-array', { nullable: true })
  public readonly tags?: string[];

  @OneToOne(() => SeedStatistics, { eager: true })
  @JoinColumn()
  public readonly statistics: SeedStatistics;

  @OneToMany('SeedAsset', 'seed', { eager: true })
  public readonly assets: SeedAsset[];
}
