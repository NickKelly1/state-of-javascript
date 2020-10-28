import { createSequelize } from "../../app/db/create-sequelize";
import { EnvServiceSingleton } from "../environment/env";
import { prettyQ } from "../helpers/pretty.helper";
import { logger } from "../logger/logger";
import { MigrationRunner } from "./migration.runner";

const scriptName = 'migration::down';

export async function migrateScriptDown(arg?: {
  step?: number,
  by?: 'batch' | 'number',
}) {
  const { step, by } = arg ?? {};
  const env = EnvServiceSingleton;
  const sequelize = createSequelize({ env });

  logger.info(`${scriptName} (${step ?? 'all'})...`);
  await sequelize.transaction(async (transaction) => {
    try {
      const qInterface = sequelize.getQueryInterface();
      qInterface.startTransaction(transaction);
      const runner = new MigrationRunner({ env, qInterface, sequelize, transaction });
      await runner.down({ step, by });
    } catch (error) {
      // TODO: how do I roll this back...?
      logger.error(`${scriptName} errored: ${prettyQ(error)}`);
      throw error;
    }
  });
  logger.info(`${scriptName} finished`);
  await sequelize.connectionManager.close();
}
