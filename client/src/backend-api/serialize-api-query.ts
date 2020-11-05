import { ApiQuery } from "./api.query.types";

export function serializeApiQuery(arg: { query?: ApiQuery }): {} {
  const { query } = arg;
  if (!query) return {};
  return { _q: query };
}