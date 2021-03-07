import { ApiError } from '../enums';
import { ApiErrorResponse } from '../types';

export const capitalize = (input: string): string => {
  if (typeof input !== 'string') {
    throw new Error('Cannot capitalize non-string value');
  }
  return input.charAt(0).toUpperCase() + input.slice(1);
};

export const parseApiError = (error: ApiErrorResponse): { title: string; message: string } => {
  if (!error) {
    return parseApiError({} as never);
  }

  const { message, code } = error;

  const apiErrorName = code && Object.values(ApiError).includes(code) ? ApiError[code] : 'UNKNOWN';

  const title = capitalize(apiErrorName.replaceAll('_', ' ').toLowerCase());

  return {
    title,
    message: message ?? 'An unknown error occurred. Please try again.',
  };
};

export const parseNumber = (input: string, radix = 10): number => {
  const parsed = Number.parseInt(input, radix);
  return !isNaN(parsed) ? parsed : undefined;
};

export const parseQueryString = (value: string | string[] | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }
  return typeof value === 'string' ? value : value[0];
};
