import { IApiExceptionData } from "./api.exception-data.interface";

export interface IApiException {
  name: string;
  code: number;
  error: string;
  message: string;
  data?: IApiExceptionData;
  stack?: string;
  trace?: string[];
}
