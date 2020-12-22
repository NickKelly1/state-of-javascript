import { Transaction } from "sequelize";
import { InitialisationException } from "../../common/exceptions/types/initialisation-exception";
import { prettyQ } from "../../common/helpers/pretty.helper";
import { IUniversalServices } from "../../common/interfaces/universal.services.interface";
import { logger } from "../../common/logger/logger";
import { OrUndefined } from "../../common/types/or-undefined.type";
import { QueryRunner } from "./query-runner";

export interface ITransactFnArg {
  runner: QueryRunner;
}

export class DbService {
  constructor(
    protected readonly universal: IUniversalServices,
  ) {
    //
  }

  /**
   * Initialise the service
   */
  protected _initialised = false;
  public async init(): Promise<void> {
    if (this._initialised) throw new InitialisationException();
    logger.info(`initialising ${this.constructor.name}...`);
    this._initialised = true;
  }

  /**
   * Use an existing transaction...
   * 
   * Creates a whole new QueryRunner
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  useTransaction(transaction: Transaction) {
    const universal = this.universal;
    return async function<T>(fn: (arg: ITransactFnArg) => Promise<T>): Promise<T> {
      const runner = new QueryRunner(transaction, universal);
      return fn({ runner });
    }
  }

  /**
   * Create a new transaction...
   */
  async transact<T>(fn: (arg: ITransactFnArg) => Promise<T>): Promise<T> {
    let transaction: OrUndefined<Transaction>;
    const seq = this.universal.sequelize;
    try {
      transaction = await seq.transaction();
      const runner = new QueryRunner(transaction, this.universal);
      const result = await fn({ runner });
      // commit...
      await transaction.commit();
      // run the after commit hooks...
      runner
        .runAfterCommitHooks()
        .catch(error => {
          logger.error(`[${this.constructor.name}::${this.transact.name}]: ERRORED running AfterCommitHooks: ${prettyQ(error)}`);
        });
      return result;
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }
}