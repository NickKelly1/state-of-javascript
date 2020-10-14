import { ALanguage, Languages } from '../i18n/consts/language.enum';
import { Exception } from '../exceptions/exception';
import { OrNullable } from '../types/or-nullable.type';

// type guards...
export const is = {
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
  notBool: <T>(arg: boolean | T): arg is T => {
    return typeof arg !== 'boolean';
  },
  language: (arg: unknown): arg is ALanguage => {
    return Languages.some(lang => arg === lang);
  },
  exception: (arg: unknown): arg is Exception => {
    try {
      return !!(arg as Exception)?.__is_exception;
    } catch (error) {
      return false;
    }
  }
}