import { QueryRunner } from "../classes/query-runner";

export type IHasRunner<T> = T & { runner: QueryRunner; };