import { createSequelize } from "../../app/db/create-sequelize";
import { EnvServiceSingleton } from "../environment/env";
import { prettyQ } from "../helpers/pretty.helper";
import { logger } from "../logger/logger";
import { MigrationRunner } from "./migration.runner";

const scriptName = 'migration::up';

export async function migrateUp(arg?: { step?: number, }): Promise<void> {
  const { step } = arg ?? {};
  const env = EnvServiceSingleton;
  const sequelize = createSequelize({ env });

  logger.info(`${scriptName} (${step ?? 'all'})...`);
  await sequelize.transaction(async (transaction) => {
    try {
      const queryInterface = sequelize.getQueryInterface();
      await queryInterface.startTransaction(transaction);
      const runner = new MigrationRunner({
        env,
        queryInterface,
        sequelize,
        transaction,
      });
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
