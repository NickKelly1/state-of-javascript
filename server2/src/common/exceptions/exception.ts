import { IExceptionData } from "../interfaces/exception-data.interface";
import { IJson } from "../interfaces/json.interface";
import { IRequestContext } from "../interfaces/request-context.interface";
import { Printable } from "../types/printable.type";
import { IExceptionArg } from "./interfaces/exception-arg.interface";

export interface IApiException {
  name: string;
  code: number;
  error: string;
  message: string;
  data?: IExceptionArg;
  stack?: string;
  trace?: string[];
}

export interface IExceptionCtorArg {
  name: string;
  code: number;
  error: string;
  message: string;
  data?: IExceptionData;
  debug?: Printable;
  ctx: IRequestContext;
}

export class Exception extends Error implements IApiException {
  public readonly __is_exception = true;

  public code: number;
  public readonly error: string;
  public readonly message: string;
  public readonly data?: IExceptionData;
  public readonly debug?: Printable;
  public trace?: string[];
  protected readonly ctx: IRequestContext;


  switchCodeTo(to: number): void {
    // naughty hack to switch 403 to 401 to notify front-ends their log-in is expired...
    this.code = to;
  }


  constructor(arg: IExceptionCtorArg) {
    super(arg.message);
    this.name = arg.name;
    this.code = arg.code;
    this.error = arg.error;
    this.message = arg.message;
    this.data = arg.data;
    this.debug = arg.debug;
    this.ctx = arg.ctx;
    this.trace = this.stack?.split('\n');
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
      stack: this.stack,
      trace: this.trace,
      debug: this.debug,
      request: this.ctx.info(),
    }
  }

  toJson(): IJson {
    if (this.ctx.services.universal.env.is_prod()) {
      return this.toJsonProd();
    }
    return this.toJsonDev();
  }

  shiftTrace(by: number) {
    try {
      if (this.trace) { this.trace.splice(0, by); }
    } catch (err) {
      // do nothing..
      console.warn('Failed to trim stack...');
    }
  }
}