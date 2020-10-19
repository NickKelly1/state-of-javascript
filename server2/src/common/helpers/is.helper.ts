import { ALanguage, Languages } from '../i18n/consts/language.enum';
import { Exception } from '../exceptions/exception';
import { OrNullable } from '../types/or-nullable.type';
import { IResponder } from '../interfaces/responder.interface';
import { Primitive } from '../types/primitive.type';
import { SqlPrimitive } from '../types/sql-primitive.type';

// type guards...
export const ist = {
//   whereAnd: (arg: unknown): unknown is => {
    

// // export type WhereOptions<TAttributes = any> =
// //   | WhereAttributeHash<TAttributes>
// //   | AndOperator<TAttributes>
// //   | OrOperator<TAttributes>
// //   | Literal
// //   | Fn
// //   | Where;
// //   },
//   whereOr: () => {

//   },
  keyof: <T>(obj: T, key: unknown): key is keyof T => {
    return ist.obj(obj) && ist.propertyKey(key) && Object.prototype.hasOwnProperty.call(obj, key);
  },
  propertyKey: (arg: unknown): arg is PropertyKey => {
    return typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'symbol';
  },
  responder: (arg: unknown): arg is IResponder => {
    return ist.obj(arg) && ist.fn((arg as IResponder).respond);
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
  primitive: (arg: unknown): arg is Primitive => {
    return ist.bool(arg)
      || ist.num(arg)
      || ist.str(arg)
      || ist.null(null)
      || ist.undefined(arg)
      || ist.symbol(arg);
  },
  notPrimitive: <T>(arg: T | Primitive): arg is T => {
    return !ist.primitive(arg);
  },
  sqlPrimitive: (arg: unknown): arg is SqlPrimitive => {
    return ist.bool(arg)
      || ist.num(arg)
      || ist.str(arg)
      || ist.null(null)
  },
  notSqlPrimitive: <T>(arg: T | SqlPrimitive): arg is T => {
    return !ist.sqlPrimitive(arg);
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