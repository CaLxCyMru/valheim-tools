import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Seed } from './seed.model';
import { SeedAssetType } from '../../enums';

export interface ISeedAsset {
  type: SeedAssetType;
  url: string;
}

@Entity()
export class SeedAsset implements ISeedAsset {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({
    type: 'enum',
    enum: SeedAssetType,
  })
  public readonly type: SeedAssetType;

  @Column()
  public readonly url: string;

  @ManyToOne('Seed', 'assets')
  public readonly seed: Seed;
}
