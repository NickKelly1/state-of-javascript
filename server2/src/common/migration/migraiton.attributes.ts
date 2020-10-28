import { Optional } from "sequelize";
import { IAuditable } from "../interfaces/auditable.interface";
import { created_at } from "../schemas/constants/created_at.const";
import { id } from "../schemas/constants/id.const";
import { updated_at } from "../schemas/constants/updated_at.const";

// initialise the migrations table
export interface IMigrationAttributes extends IAuditable {
  id: number;
  path: string;
  name: string;
  number: number;
  batch: number;
}

export interface IMigrationCreationAttributes extends Optional<IMigrationAttributes, | id | created_at | updated_at> {};

