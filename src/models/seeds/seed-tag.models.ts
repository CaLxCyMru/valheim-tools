import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Dates, IDates } from '../common';
import { ISeed } from './seed.model';

export interface ISeedTag extends IDates {
  id: string;
  tag: string;
  seeds?: ISeed[];
}

@Entity()
export class SeedTag extends Dates implements ISeedTag {
  @IsNotEmpty()
  @IsString()
  @IsUUID('4')
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @Column({ length: 20, unique: true })
  public readonly tag: string;

  @ManyToMany('Seed', 'tags')
  public readonly seeds?: ISeed[];
}
