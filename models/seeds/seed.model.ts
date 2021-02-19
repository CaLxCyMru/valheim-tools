import { Dates, IDates } from '../common/dates.model';
import { ISeedAsset, SeedAsset } from './seed-asset.model';
import { ISeedStatistics, SeedStatistics } from './seed-statistics.model';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AuthUser, IAuthUser } from '../auth-user';

export interface ISeed extends IDates {
  id: string;
  seed: string;
  description: string;
  tags?: string[];
  statistics: ISeedStatistics;
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

  @OneToOne(() => SeedStatistics, { eager: true })
  @JoinColumn()
  public readonly statistics: SeedStatistics;

  @OneToMany('SeedAsset', 'seed', { eager: true })
  public readonly assets: SeedAsset[];

  @ManyToOne('AuthUser', 'seeds', { eager: true })
  public readonly createdBy: AuthUser;
}
