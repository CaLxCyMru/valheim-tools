import {
  IsAlphanumeric,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthUser } from '../auth-user/auth-user.model';
import { Dates, IDates } from '../common/dates.model';
import { ISeedAsset, SeedAsset } from './seed-asset.model';
import { SeedOverview } from './seed-overview.model';
import { ISeedStatistic, SeedStatistic } from './seed-statistic.model';
import { ISeedTag, SeedTag } from './seed-tag.models';

export interface ISeed extends IDates {
  id: string;
  seed: string;
  title: string;
  description: string;
  tags?: ISeedTag[];
  statistics?: ISeedStatistic[];
  assets: ISeedAsset[];
  createdBy: AuthUser | string | number;
  overview: SeedOverview;
}

@Entity()
export class Seed extends Dates implements ISeed {
  @IsNotEmpty()
  @IsString()
  @IsUUID('4')
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @MinLength(1)
  @MaxLength(10)
  @Column({ unique: true })
  public readonly seed: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  @Column()
  public readonly title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(10000)
  @Column('text')
  public readonly description: string;

  @IsOptional()
  @IsNotEmpty({ each: true })
  @IsArray()
  @ManyToMany('SeedTag', 'seeds', { eager: true })
  @JoinTable({ name: 'seed_tags' })
  public readonly tags?: SeedTag[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @OneToMany('SeedStatistic', 'seed', { eager: false })
  public readonly statistics?: SeedStatistic[];

  @IsArray()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @OneToMany('SeedAsset', 'seed', { eager: true, cascade: ['insert', 'remove', 'update'] })
  public readonly assets: SeedAsset[];

  @IsOptional()
  @ManyToOne('AuthUser', 'seeds', { eager: true })
  public readonly createdBy: AuthUser | string | number;

  public overview: SeedOverview;
}
