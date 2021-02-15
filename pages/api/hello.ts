import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');

  if (!response) {
    res.status(500).json({ error: 'Error calling API' });
  }

  const data = await response.json();

  res.status(200).json(data);
};
