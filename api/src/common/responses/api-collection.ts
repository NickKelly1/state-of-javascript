import { IApiCollection } from "../interfaces/api-collection.interface";
import { IPaginateInput } from "../interfaces/pageinate-input.interface";
import { IRowsWithCount } from "../interfaces/rows-with-count.interface";
import { collectionMeta } from "./collection-meta";

export function apiCollection<T>(arg: {
  data: T[]
  total: number;
  page: IPaginateInput,
}): IApiCollection<T> {
  const { data, page, total } = arg;
  const pagination = collectionMeta({ data, total, page });
  return { data, pagination };
}
