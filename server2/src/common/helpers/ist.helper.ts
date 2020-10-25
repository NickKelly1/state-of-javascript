import { OrNullable } from '../types/or-nullable.type';

// type guards...
export const ist = {
  keyof: <T>(obj: T, key: unknown): key is keyof T => {
    return ist.obj(obj) && ist.propertyKey(key) && Object.prototype.hasOwnProperty.call(obj, key);
  },
  propertyKey: (arg: unknown): arg is PropertyKey => {
    return typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'symbol';
  },
  obj: (arg: unknown): arg is Record<PropertyKey, any> => {
    return typeof arg === 'object' && arg !== null;
  },
  undefined: (arg: unknown): arg is undefined => {
    return typeof arg === 'undefined';
  },
  notUndefined<T>(arg: undefined | T): arg is T {
    return arg !== undefined;
  },
  nullable: (arg: unknown): arg is null | undefined => {
    return arg === null || arg === undefined;
  },
  notNullable: <T>(arg: OrNullable<T>): arg is T => {
    return arg !== null && arg !== undefined;
  },
  defined: <T>(arg: OrNullable<T>): arg is T => {
    return ist.notNullable(arg);
  },
  null: (arg: unknown): arg is null => {
    return arg === null;
  },
  notNull<T>(arg: null | T): arg is T {
    return arg !== null;
  },
  fn: (arg: unknown): arg is Function => {
    return typeof arg === 'function';
  },
  notFn: <T>(arg: Function | T): arg is T => {
    return typeof arg !== 'function';
  },
  str: (arg: unknown): arg is string => {
    return typeof arg === 'string';
  },
  notStr: <T>(arg: string | T): arg is T => {
    return typeof arg !== 'string';
  },
  num: (arg: unknown): arg is string => {
    return typeof arg === 'number';
  },
  notNum: <T>(arg: number | T): arg is T => {
    return typeof arg !== 'number';
  },
  bool: (arg: unknown): arg is boolean => {
    return typeof arg === 'boolean';
  },
  symbol: (arg: unknown): arg is symbol => {
    return typeof arg === 'symbol';
  },
  notSymbol: <T>(arg: T | symbol): arg is T => {
    return typeof arg !== 'symbol';
  },
  notBool: <T>(arg: boolean | T): arg is T => {
    return typeof arg !== 'boolean';
  },
}