import { ViewColumn, ViewEntity } from 'typeorm';

export interface ISeedOverview {
  likes: number;
}

@ViewEntity({
  expression: `
    SELECT SUM(IF(liked = 1, 1, 0)) AS likes,  SUM(IF(disliked = 1, 1, 0)) AS dislikes, seedId
    FROM seed_statistic SS
    LEFT JOIN seed S on S.id = SS.seedId
    GROUP BY seedId
  `,
})
export class SeedOverview implements ISeedOverview {
  @ViewColumn()
  public readonly likes: number;

  @ViewColumn()
  public readonly dislikes: number;

  @ViewColumn()
  public readonly seedId: string;
}
