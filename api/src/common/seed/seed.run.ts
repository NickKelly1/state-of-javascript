// todo re-implement this...
export {}


// import { createSequelize } from "../../app/db/create-sequelize";
// import { initialiseDb } from "../../initialise-db";
// import { SystemContext } from "../context/system.context";
// import { EnvServiceSingleton } from "../environment/env";
// import { prettyQ } from "../helpers/pretty.helper";
// import { logger } from "../logger/logger";
// import { SeedRunner } from "./seed.runner";

// const scriptName = 'seed';

// export async function seedRun(arg?: { step?: number }) {
//   const { step } = arg ?? {};
//   const env = EnvServiceSingleton;
//   const sequelize = createSequelize({ env });
//   await initialiseDb({ sequelize, env });
//   // TODO...
//   // const universal = universalServiceContainerFactory({ env, sequelize });
//   const ctx = new SystemContext(universal);

//   // initialise the database...
//   // includes running migrations
//   // seeders require models & database to be up-to-date
//   await initialiseDb({ env, sequelize });

//   logger.info(`${scriptName} (${step ?? 'all'})...`);
//   await sequelize.transaction(async (transaction) => {
//     try {
//       const queryInterface = sequelize.getQueryInterface();
//       queryInterface.startTransaction(transaction);
//       const runner = new SeedRunner({
//         ctx,
//         env,
//         queryInterface,
//         sequelize,
//         transaction,
//       });
//       await runner.run()
//     } catch (error) {
//       // TODO: how do I roll this back...?
//       logger.error(`${scriptName} errored: ${prettyQ(error)}`);
//       throw error;
//     }
//   });
//   logger.info(`${scriptName} finished`);
//   await sequelize.connectionManager.close();
// }
