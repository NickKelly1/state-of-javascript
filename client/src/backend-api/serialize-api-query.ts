import { ApiQuery } from "./api.query.types";

export function serializeApiQuery(arg: { query?: ApiQuery }): {} {
  const { query } = arg;
  if (!query) return {};
  console.log('serializing api query:', query);
  return { _q: query };
}