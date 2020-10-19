import { ICollectionMeta } from "./collection-meta.interface";

export interface IApiCollection<T> {
  data: T[];
  meta: ICollectionMeta;
}