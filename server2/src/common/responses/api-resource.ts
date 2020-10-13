import { IApiResource } from "../interfaces/api-resource.interface";


export function apiResource<T>(arg: { result: T }): IApiResource<T> {
  const { result } = arg;
  return { data: result };
}