export interface IPaginatedResponse<T> {
  statusCode: number;
  message: string;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface IResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface IErrorResponse {
  statusCode: number;
  message: string;
  errors: {
    [key: string]: string;
  };
}
