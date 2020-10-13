import { ValidationError } from "joi";
import { IExceptionData } from "../interfaces/exception-data.interface";
import { OrUndefined } from "../types/or-undefined.type";

export function exceptionData(error: ValidationError): IExceptionData {
  const data: IExceptionData = {};
  error.details.map(detail => {
    const key = detail.context?.key;
    if (key) {
      let val: OrUndefined<string[]> = data[key];
      if (!val) {
        val = [];
        data[key] = val
      }
      val.push(detail.message);
    }
  });
  return data;
}