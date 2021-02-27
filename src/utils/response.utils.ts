import { NextApiResponse } from 'next';
import { ApiError } from '../enums';

export const response = (
  res: NextApiResponse,
  status: number,
  data: { [key: string]: unknown },
): void => {
  res.setHeader('Content-Type', 'application/json');
  res.status(status).json(data);
};

export const error = (
  res: NextApiResponse,
  message: string,
  code: ApiError,
  meta?: { [key: string]: unknown },
  status = 400,
): void => response(res, status, { error: { message, code, ...(meta ? { meta } : undefined) } });

export const success = (
  res: NextApiResponse,
  data: unknown,
  meta?: { [key: string]: unknown },
  status = 200,
): void => response(res, status, { data, ...(meta ? { meta } : undefined) });
