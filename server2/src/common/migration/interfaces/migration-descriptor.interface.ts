import { IConstructor } from "../../interfaces/constructor.interface";
import { IMigration } from "./migration.interface";

export interface IMigrationDescriptor {
  number: number;
  name: string;
  file: string;
  Ctor: IConstructor<IMigration>
}
