import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface ISeedStatistics {
  likes: number;
  dislikes: number;
}

@Entity()
export class SeedStatistics implements ISeedStatistics {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({ default: 0 })
  public readonly likes: number;

  @Column({ default: 0 })
  public readonly dislikes: number;
}
