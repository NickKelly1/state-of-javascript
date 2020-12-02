export type IJsonPrimitive = string | number | boolean | null;
export type IJsonValue = IJsonPrimitive | IJsonPrimitive[] | IJsonObject | IJsonObject[] | object | object[];
export interface IJsonObject {
  [key1: string]: IJsonValue;
  [key2: number]: IJsonValue;
}
export type IJson = IJsonValue;
