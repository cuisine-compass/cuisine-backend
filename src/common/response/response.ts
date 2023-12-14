import { Response } from 'express';

export class ApiDecorator<T> {
  statusCode: number;
  message: string;
  data: {};
  res: Response;

  constructor(statusCode: number = 200, message: string, data?: T) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }
}

export function ApiResponse(
  statusCode: number = 200,
  message: string,
  data?: any,
  res?: Response,
) {
  if (res)
    return res
      .status(statusCode)
      .json(new ApiDecorator(statusCode, message, data));
  return new ApiDecorator(statusCode, message, data);
}
