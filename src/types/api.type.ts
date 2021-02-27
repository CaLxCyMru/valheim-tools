export interface ApiResponse<T> {
  data: T;
  meta: { [key: string]: unknown };
}
