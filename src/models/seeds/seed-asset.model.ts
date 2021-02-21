import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Seed } from './seed.model';
import { SeedAssetType } from '../../enums';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export interface ISeedAsset {
  id?: string;
  type: SeedAssetType;
  path: string;
}

@Entity()
export class SeedAsset implements ISeedAsset {
  @IsNotEmpty()
  @IsString()
  @IsUUID('4')
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @IsNotEmpty()
  @IsEnum(SeedAssetType)
  @Column({
    type: 'enum',
    enum: SeedAssetType,
  })
  public readonly type: SeedAssetType;

  @IsNotEmpty()
  @IsString()
  @Column()
  public readonly path: string;

  @ManyToOne('Seed', 'assets')
  public readonly seed: Seed;
}
