import { Env } from "@src/env";
import { IException } from "@src/interfaces/exception.interface";
import { IJson } from "@src/interfaces/json.interface";

export abstract class BaseException extends Error implements IException {
  public readonly __is_exception = true;
  public readonly name: string;

  constructor() {
    super();
    this.name = this.constructor.name;
  }

  public abstract code: number;
  public abstract message: string;
  public abstract error: string;
  data?: Record<string, string[]> = undefined;

  toJson(): IJson {
    if (Env.is_prod()) {
      return {
        error: this.error,
        message: this.message,
        data: this.data,
      }
    }

    return {
      error: this.error,
      message: this.message,
      data: this.data,
      stack: this.stack,
      name: this.name,
    }
  }
}