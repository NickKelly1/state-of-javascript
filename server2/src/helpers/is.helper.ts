import { IException } from "@src/interfaces/exception.interface";
import { ALanguage, Languages } from "../langs/consts/language.enum";

// type guards...
export const is = {
  fn: (arg: unknown): arg is Function => {
    return typeof arg === 'function';
  },
  str: (arg: unknown): arg is string => {
    return typeof arg === 'string';
  },
  num: (arg: unknown): arg is string => {
    return typeof arg === 'number';
  },
  bool: (arg: unknown): arg is boolean => {
    return typeof arg === 'boolean';
  },
  language: (arg: unknown): arg is ALanguage => {
    return Languages.some(lang => arg === lang);
  },
  exception: (arg: unknown): arg is IException => {
    try {
      return !!(arg as IException).__is_exception;
    } catch (error) {
      return false;
    }
  }
}