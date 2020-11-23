import { ApiException } from "../backend-api/api.exception";

export interface IOnErrorFn { (error: ApiException): any; }