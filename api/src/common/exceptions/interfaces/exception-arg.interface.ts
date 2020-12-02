import { IExceptionData } from "../../interfaces/exception-data.interface";
import { Printable } from "../../types/printable.type";

export interface IExceptionArg {
  error?: string;
  message?: string;
  data?: IExceptionData;
  debug?: Printable;
}