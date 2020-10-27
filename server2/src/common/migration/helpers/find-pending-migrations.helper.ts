import { QueryInterface, Sequelize, Transaction } from "sequelize/types";
import { EnvService } from "../../environment/env";
import { ist } from "../../helpers/ist.helper";
import { IMigrationDescriptor } from "../interfaces/migration-descriptor.interface";
import { MigrationModel } from "../model/migraiton.model";
import { deepScanMigrationDescriptors } from "./scan-migrations.helper";

export async function findPendingMigrations(arg: {
  env: EnvService;
  transaction: Transaction;
  qInterface: QueryInterface;
  sequelize: Sequelize,
}): Promise<{ pending: IMigrationDescriptor[], nextBatch: number }> {
  const {
    env,
    transaction,
    qInterface,
    sequelize,
  } = arg;

  // find previous migraitons
  const [
    lastMigration,
    foundMigrations,
  ] = await Promise.all([
    MigrationModel.findOne({
        transaction,
        order: [[ 'number', 'DESC' ]],
        limit: 1,
    }),
    deepScanMigrationDescriptors(env.MIGRATIONS_DIR),
  ]);

  const lastMigrationNumber = lastMigration?.number;
  const nextBatch = (lastMigration?.batch ?? 0) + 1;

  const pendingMigrations = ist.nullable(lastMigrationNumber)
    ? foundMigrations
    : foundMigrations.filter(found => found.number > lastMigrationNumber);

  return {
    pending: pendingMigrations,
    nextBatch,
  }
} 