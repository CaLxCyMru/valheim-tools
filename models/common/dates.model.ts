import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export interface IDates {
  created: Date;
  updated: Date;
}

export abstract class Dates implements IDates {
  @CreateDateColumn({ type: 'datetime' })
  public readonly created: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public readonly updated: Date;
}
