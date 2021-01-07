import { Exception } from "../exceptions/exception";
import { ALanguage, Languages } from "../i18n/consts/language.enum";
import { Primitive } from "../types/primitive.type";
import { SqlPrimitive } from "../types/sql-primitive.type";
import { ist } from "./ist.helper";

export const isu = {
  primitive: (arg: unknown): arg is Primitive => {
    return ist.bool(arg)
      || ist.num(arg)
      || ist.str(arg)
      || ist.null(null)
      || ist.undefined(arg)
      || ist.symbol(arg);
  },
  notPrimitive: <T>(arg: T | Primitive): arg is T => {
    return !isu.primitive(arg);
  },
  sqlPrimitive: (arg: unknown): arg is SqlPrimitive => {
    return ist.bool(arg)
      || ist.num(arg)
      || ist.str(arg)
      || ist.null(null)
  },
  notSqlPrimitive: <T>(arg: T | SqlPrimitive): arg is T => {
    return !isu.sqlPrimitive(arg);
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