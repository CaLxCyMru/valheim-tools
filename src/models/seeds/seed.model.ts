import {
  IsAlphanumeric,
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AuthUser } from '../auth-user/auth-user.model';
import { Dates, IDates } from '../common/dates.model';
import { ISeedAsset, SeedAsset } from './seed-asset.model';
import { SeedOverview } from './seed-overview.model';
import { ISeedStatistic, SeedStatistic } from './seed-statistic.model';

export interface ISeed extends IDates {
  id: string;
  seed: string;
  title?: string;
  description: string;
  tags?: string[];
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

  @IsOptional()
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
  @Column('simple-array', { nullable: true })
  public readonly tags?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @OneToMany('SeedStatistic', 'seed', { eager: true })
  public readonly statistics?: SeedStatistic[];

  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @OneToMany('SeedAsset', 'seed', { eager: true, cascade: ['insert', 'remove', 'update'] })
  public readonly assets: SeedAsset[];

  @IsOptional()
  @ManyToOne('AuthUser', 'seeds', { eager: true })
  public readonly createdBy: AuthUser | string | number;

  public overview: SeedOverview;
}
