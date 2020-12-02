import { IApiResource } from "../interfaces/api-resource.interface";


export function apiResource<T>(arg: {
  data: T,
}): IApiResource<T> {
  const { data } = arg;
  return { data };
}