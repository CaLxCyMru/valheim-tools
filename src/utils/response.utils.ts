import { NextApiResponse } from 'next';

export const response = (
  res: NextApiResponse,
  status: number,
  data: { [key: string]: unknown },
): void => {
  res.status(status);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
};

export const error = (
  res: NextApiResponse,
  message: string,
  meta?: { [key: string]: unknown },
  status = 400,
): void => response(res, status, { error: { message, ...(meta ? { meta } : undefined) } });

export const success = (
  res: NextApiResponse,
  message: string,
  meta?: { [key: string]: unknown },
  status = 200,
): void => response(res, status, { data: { message, ...(meta ? { meta } : undefined) } });
