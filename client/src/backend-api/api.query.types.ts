import { K2K } from "../types/k2k.type";

export type ApiFilterRange = [string | number, string | number];

export interface ApiConditionValue<T> { _val: T; }
export interface ApiConditionOr<T> { _or: T[]; }
export interface ApiConditionAnd<T> { _and: T[]; }
export interface ApiConditionAttributes { _attr: ApiFilterAttributes; }
export type ApiConditional<T> = ApiConditionValue<T> | ApiConditionOr<ApiConditional<T>> | ApiConditionAnd<ApiConditional<T>>;
export type ApiFilterAttributes = Partial<Record<PropertyKey, ApiConditional<ApiFilterOperators>>>;

// val
export type _val = K2K<ApiConditionValue<any>>['_val'];
export const _val: _val = '_val';
// and
export type _and = K2K<ApiConditionAnd<any>>['_and'];
export const _and: _and = '_and';
// or
export type _or = K2K<ApiConditionOr<any>>['_or'];
export const _or: _or = '_or';
// attr
export type _attr = K2K<ApiConditionAttributes>['_attr'];
export const _attr: _attr = '_attr';

export type ApiFilterOperators = {[F in keyof ApiFilterOperatorsTypes]?: ApiConditional<ApiFilterOperatorsTypes[F]> }

export type ApiFilter = ApiConditionAttributes | ApiConditionOr<ApiFilter> | ApiConditionAnd<ApiFilter>;

export interface ApiFilterOperatorsTypes {
  _eq: string | number | boolean;
  _neq: string | number | boolean;

  _null: boolean;
  _gt: string | number;
  _gte: string | number;

  _lt: string | number;
  _lte: string | number;

  _nbetween: ApiFilterRange;
  _between: ApiFilterRange;

  _in: (string | number | boolean)[];
  _nin: (string | number | boolean)[];

  _ilike: string;
  _nilike: string;

  _like: string;
  _nlike: string;

  _overlap: ApiFilterRange;

  _substring: string;

  _iregexp: string;
  _niregexp: string;

  _regexp: string;
  _nregexp: string;

  _strict_left: ApiFilterRange;
  _strict_right: ApiFilterRange;
}

export type ApiOp = K2K<ApiFilterOperatorsTypes>;
export const ApiOp: ApiOp  = {
  _eq: '_eq',
  _neq: '_neq',

  _null: '_null',
  _gt: '_gt',
  _gte: '_gte',

  _lt: '_lt',
  _lte: '_lte',

  _nbetween: '_nbetween',
  _between: '_between',

  _in: '_in',
  _nin: '_nin',

  _ilike: '_ilike',
  _nilike: '_nilike',

  _like: '_like',
  _nlike: '_nlike',

  _overlap: '_overlap',

  _substring: '_substring',

  _iregexp: '_iregexp',
  _niregexp: '_niregexp',

  _regexp: '_regexp',
  _nregexp: '_nregexp',

  _strict_left: '_strict_left',
  _strict_right: '_strict_right',
}

export enum ApiDir { Desc = -1, Asc = 1, }
export interface ApiSort { field: string, dir: ApiDir };
export type ApiSorts = ApiSort[];

export interface ApiQuery {
  offset?: number;
  limit?: number;
  filter?: ApiFilter;
  sorts?: ApiSorts;
}