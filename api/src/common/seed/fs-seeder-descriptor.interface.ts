import { IConstructor } from "../interfaces/constructor.interface";
import { ISeeder } from "./seeder.interface";

export interface IFsSeederDescriptor {
  number: number;
  name: string;
  file: string;
  Ctor: IConstructor<ISeeder>
}
