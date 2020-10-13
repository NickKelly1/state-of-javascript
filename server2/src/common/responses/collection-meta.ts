import { ICollectionMeta } from "../interfaces/collection-meta.interface";
import { IPaginateInput } from "../interfaces/pageinate-input.interface";
import { IRowsWithCount } from "../interfaces/rows-with-count.interface";

export function collectionMeta<T>(arg: {
  results: IRowsWithCount<T>;
  page: IPaginateInput;
}): ICollectionMeta {
  const { page, results } = arg;
  const { limit, offset } = page;
  const { count, rows } = results;

  const total = count;
  const on_page = rows.length;
  // limit = 5,
  //  count = 0 => pages = Math.ceil(1 / 5) = 1
  //  count = 1 => pages = Math.ceil(2 / 5) = 1
  //  count = 4 => pages = Math.ceil(5 / 5) = 1
  //  count = 5 => pages = Math.ceil(6 / 5) = 2
  const pages = Math.ceil((count + 1) / limit);

  // limit = 5,
  //  offset = 0 => page_number = Math.ceil(1 / 5) = 1
  //  offset = 1 => page_number = Math.ceil(2 / 5) = 1
  //  offset = 4 => page_number = Math.ceil(5 / 5) = 1
  //  offset = 5 => page_number = Math.ceil(6 / 5) = 2
  const page_number = Math.ceil((offset + 1) / limit);

  const more = page_number < pages;

  return { limit, offset, total, on_page, page_number, pages, more, };
}