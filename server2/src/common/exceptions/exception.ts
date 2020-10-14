import { IExceptionData } from "../interfaces/exception-data.interface";
import { IJson } from "../interfaces/json.interface";
import { IRequestContext } from "../interfaces/request-context.interface";
import { Printable } from "../types/printable.type";
import { IExceptionArg } from "./interfaces/exception-arg.interface";

export interface IExceptionCtorArg {
  name: string;
  code: number;
  error: string;
  message: string;
  data?: IExceptionData;
  debug?: Printable;
  ctx: IRequestContext;
}

export class Exception extends Error {
  public readonly __is_exception = true;

  public readonly code: number;
  public readonly error: string;
  public readonly message: string;
  public readonly data?: IExceptionData;
  public readonly debug?: Printable;
  protected readonly ctx: IRequestContext;


  constructor(arg: IExceptionCtorArg) {
    super(arg.message);
    this.name = arg.name;
    this.code = arg.code;
    this.error = arg.error;
    this.message = arg.message;
    this.data = arg.data;
    this.debug = arg.debug;
    this.ctx = arg.ctx;
  }

  toJsonProd(): IJson {
    return {
      error: this.error,
      code: this.code,
      message: this.message,
      data: this.data,
    }
  }

  toJsonDev(): IJson {
    return {
      name: this.name,
      error: this.error,
      code: this.code,
      message: this.message,
      data: this.data,
      stack: this.stack?.split('\n'),
      debug: this.debug,
      request: this.ctx.info(),
    }
  }

  toJson(): IJson {
    if (this.ctx.services.env().is_prod()) {
      return this.toJsonProd();
    }
    return this.toJsonDev();
  }

  shiftStack(by: number) {
    try {
      if (this.stack) {
        const split = this.stack.split('\n');
        this.stack = [split[0]].concat(split.slice(1 + by, split.length)).join('\n');
      }
    } catch (err) {
      // do nothing..
      console.warn('Failed to trim stack...');
    }
  }
}