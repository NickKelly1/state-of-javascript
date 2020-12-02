import { IJson } from "../interfaces/json.interface";
import { Primitive } from "./primitive.type";


export type Printable = Primitive | Primitive[] | IJson | IJson[];