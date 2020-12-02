import { Sequelize, Transaction } from "sequelize";
import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { OrUndefined } from "../../common/types/or-undefined.type";
import { QueryRunner } from "./query-runner";

export interface ITransactFnArg {
  runner: QueryRunner;
}

export class DbService {
  constructor(
    protected readonly sequelize: Sequelize,
  ) {
    //
  }

  useTransaction(transaction: Transaction) {
    return async function<T>(fn: (arg: ITransactFnArg) => Promise<T>): Promise<T> {
      const runner = new QueryRunner(transaction);
      return fn({ runner });
    }
  }

  async transact<T>(fn: (arg: ITransactFnArg) => Promise<T>): Promise<T> {
    let transaction: OrUndefined<Transaction>;
    const seq = this.sequelize;
    try {
      transaction = await seq.transaction();
      const runner = new QueryRunner(transaction);
      const result = await fn({ runner });
      // commit...
      await transaction.commit();
      // run the after commit hooks...
      await runner.runAfterCommitHooks();
      return result;
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }
}