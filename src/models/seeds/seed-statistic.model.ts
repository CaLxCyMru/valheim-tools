import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface ISeedStatistic {
  likes: number;
  dislikes: number;
}

@Entity()
export class SeedStatistic implements ISeedStatistic {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({ default: 0 })
  public readonly likes: number;

  @Column({ default: 0 })
  public readonly dislikes: number;
}
