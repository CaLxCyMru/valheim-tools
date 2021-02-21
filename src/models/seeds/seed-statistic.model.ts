import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AuthUser } from '../auth-user/auth-user.model';
import { Dates, IDates } from '../common';
import { Seed } from './seed.model';

export interface ISeedStatistic extends IDates {
  liked: boolean;
  disliked: boolean;
}

@Entity()
export class SeedStatistic extends Dates implements ISeedStatistic {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({ default: false })
  public readonly liked: boolean;

  @Column({ default: false })
  public readonly disliked: boolean;

  @ManyToOne('Seed', 'statistics')
  public readonly seed: Seed;

  @ManyToOne('AuthUser', 'seedStatistics')
  public readonly user: AuthUser;
}
