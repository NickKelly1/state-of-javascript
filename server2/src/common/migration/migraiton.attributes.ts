import { Optional } from "sequelize";
import { IAuditable } from "../interfaces/auditable.interface";
import { created_at } from "../schemas/constants/created_at.const";
import { id } from "../schemas/constants/id.const";
import { updated_at } from "../schemas/constants/updated_at.const";

// initialise the migrations table
export interface IMigrationAttributes {
  id: number;
  name: string;
  number: number;
  batch: number;
  ran_at: Date;
}

export interface IMigrationCreationAttributes extends Optional<IMigrationAttributes, | id > {};

