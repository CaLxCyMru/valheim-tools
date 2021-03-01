import { ApiError } from './../enums/api-error.enum';
export interface ApiResponse<T> {
  data?: T;
  error?: ApiErrorResponse;
  meta: { [key: string]: unknown };
}

export interface ApiErrorResponse {
  message: string;
  code: ApiError;
}
