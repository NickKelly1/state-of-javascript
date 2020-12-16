import { OrUndefined } from "../../types/or-undefined.type";
import { IApiExceptionData } from "./api.exception-data.interface";

export interface IApiException {
  name: string;
  code: number;
  message: string;
  data?: IApiExceptionData;
  stack?: string;
  trace?: string[];
}

export interface IPartialApiException {
  name?: OrUndefined<string>;
  code: number;
  message?: OrUndefined<string>;
  data?: IApiExceptionData;
  stack?: string;
  trace?: string[];
}
