import { createSequelize } from "../../app/db/create-sequelize";
import { EnvServiceSingleton } from "../environment/env";
import { prettyQ } from "../helpers/pretty.helper";
import { logger } from "../logger/logger";
import { MigrationRunner } from "./migration.runner";

const scriptName = 'migration::up';

export async function migrateScriptUp(arg?: { step?: number }) {
  const { step } = arg ?? {};
  const env = EnvServiceSingleton;
  const sequelize = createSequelize({ env });

  logger.info(`${scriptName} (${step ?? 'all'})...`);
  await sequelize.transaction(async (transaction) => {
    try {
      const qInterface = sequelize.getQueryInterface();
      qInterface.startTransaction(transaction);
      const runner = new MigrationRunner({ env, qInterface, sequelize, transaction });
      await runner.up({ step });
    } catch (error) {
      // TODO: how do I roll this back...?
      logger.error(`${scriptName} errored: ${prettyQ(error)}`);
      throw error;
    }
  });
  logger.info(`${scriptName} finished`);
  await sequelize.connectionManager.close();
}
