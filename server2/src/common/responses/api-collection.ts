import { IApiCollection } from "../interfaces/api-collection.interface";
import { IPaginateInput } from "../interfaces/pageinate-input.interface";
import { IRowsWithCount } from "../interfaces/rows-with-count.interface";
import { collectionMeta } from "./collection-meta";

export function apiCollection<T>(arg: {
  results: IRowsWithCount<T>,
  page: IPaginateInput,
}): IApiCollection<T> {
  const { results, page } = arg;
  const { rows } = results;
  const meta = collectionMeta({ results, page });
  return { data: rows, meta };
}
