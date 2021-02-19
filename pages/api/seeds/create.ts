// import { DateTime, Duration } from 'luxon';
import { NextApiRequest, NextApiResponse } from 'next';
// import { SeedAssetType } from '../../../enums';
// import { ISeed, Seed } from '../../../models';
// import { createConnection } from '../lib/seeds-db';

// const randomNumber = (min: number, max: number) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const data: ISeed[] = [
//   {
//     id: '01422ebf-2b28-4209-afc6-b58e89a52ef5',
//     seed: '7SWT9BBVEZ',
//     description:
//       'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
//     statistics: {
//       likes: randomNumber(0, 5000),
//       dislikes: 0,
//     },
//     created: DateTime.now()
//       .minus(Duration.fromObject({ seconds: randomNumber(1, 6000) }))
//       .toJSDate(),
//     updated: new Date(),
//     assets: [
//       {
//         type: SeedAssetType.PREVIEW,
//         url: '/assets/example/preview.jpg',
//       },
//     ],
//   },
//   {
//     id: '72a12fc5-c941-448d-b577-4e8e4901ae6d',
//     seed: '3RL7KFQ3FK',
//     description:
//       'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
//     statistics: {
//       likes: randomNumber(0, 5000),
//       dislikes: 0,
//     },
//     created: DateTime.now()
//       .minus(Duration.fromObject({ seconds: randomNumber(1, 6000) }))
//       .toJSDate(),
//     updated: new Date(),
//     assets: [
//       {
//         type: SeedAssetType.PREVIEW,
//         url: '/assets/example/preview.jpg',
//       },
//     ],
//   },
//   {
//     id: '86a0af30-d8ce-442c-a818-8b0079b6b409',
//     seed: 'ASWZ7LE5N3',
//     description:
//       'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
//     statistics: {
//       likes: randomNumber(0, 5000),
//       dislikes: 0,
//     },
//     created: DateTime.now()
//       .minus(Duration.fromObject({ seconds: randomNumber(1, 6000) }))
//       .toJSDate(),
//     updated: new Date(),
//     assets: [
//       {
//         type: SeedAssetType.PREVIEW,
//         url: '/assets/example/preview.jpg',
//       },
//     ],
//   },
//   {
//     id: '912692c2-404d-45d2-9d5d-9a26a3683d48',
//     seed: 'ZNMJDW11K7',
//     description:
//       'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
//     statistics: {
//       likes: randomNumber(0, 5000),
//       dislikes: 0,
//     },
//     created: DateTime.now()
//       .minus(Duration.fromObject({ seconds: randomNumber(1, 6000) }))
//       .toJSDate(),
//     updated: new Date(),
//     assets: [
//       {
//         type: SeedAssetType.PREVIEW,
//         url: '/assets/example/preview.jpg',
//       },
//     ],
//   },
// ];

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // const connection = await createConnection();
  // const repo = connection.getRepository(Seed);
  // for (const s of data) {
  //   await repo.insert(s);
  // }
  // res.status(200).json(true);
};
