import { Env } from "../../environment/env";
import { IExceptionData } from "../interfaces/exception-data.interface";
import { IJson } from "../interfaces/json.interface";
import { Printable } from "../types/printable.type";
import { IExceptionArg } from "./interfaces/exception-arg.interface";

export interface IExceptionCtorArg {
  name: string;
  code: number;
  error: string;
  message: string;
  data?: IExceptionData;
  debug?: Printable;
}

export class Exception extends Error {
  public readonly __is_exception = true;

  public readonly code: number;
  public readonly error: string;
  public readonly message: string;
  public readonly data?: IExceptionData;
  public readonly debug?: Printable;


  constructor(arg: IExceptionCtorArg) {
    super(arg.message);
    this.name = arg.name;
    this.code = arg.code;
    this.error = arg.error;
    this.message = arg.message;
    this.data = arg.data;
    this.debug = arg.debug;
  }

  toJson(): IJson {
    if (Env.is_prod()) {
      return {
        error: this.error,
        code: this.code,
        message: this.message,
        data: this.data,
      }
    }

    return {
      name: this.name,
      error: this.error,
      code: this.code,
      message: this.message,
      data: this.data,
      stack: this.stack?.split('\n'),

      debug: this.debug,
    }
  }
}