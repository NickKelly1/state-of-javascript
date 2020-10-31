import { createSequelize } from "../../app/db/create-sequelize";
import { ScriptGuard } from "../../script-guard";
import { EnvServiceSingleton } from "../environment/env";
import { prettyQ } from "../helpers/pretty.helper";
import { logger } from "../logger/logger";
import { MigrationRunner } from "./migration.runner";

const scriptName = 'migration::down';

export async function migrateDown(arg?: {
  step?: number,
  by?: 'batch' | 'number',
}) {
  // check we can execute scripts...
  ScriptGuard.check();

  const { step, by } = arg ?? {};
  const env = EnvServiceSingleton;
  const sequelize = createSequelize({ env });

  logger.info(`${scriptName} (${step ?? 'all'})...`);
  await sequelize.transaction(async (transaction) => {
    try {
      const queryInterface = sequelize.getQueryInterface();
      queryInterface.startTransaction(transaction);
      const runner = new MigrationRunner({
        env,
        queryInterface,
        sequelize,
        transaction,
      });
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
