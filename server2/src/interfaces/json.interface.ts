import { Primitive } from "../types/primitive.type";

export interface IJson { [K: string]: Primitive | Primitive[] | IJson | IJson[] };