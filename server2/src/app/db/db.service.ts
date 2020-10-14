import { Sequelize, Transaction } from "sequelize/types";
import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { OrUndefined } from "../../common/types/or-undefined.type";
import { QueryRunner } from "./query-runner";

export interface ITransactFnArg {
  runner: QueryRunner;
}

export class DbService {
  constructor(
    protected readonly ctx: IRequestContext,
    protected readonly sequelize: Sequelize,
  ) {
    //
  }

  async transact<T>(fn: (arg: ITransactFnArg) => Promise<T>): Promise<T> {
    let transaction: OrUndefined<Transaction>;
    const seq = this.sequelize;
    try {
      transaction = await seq.transaction();
      const runner = new QueryRunner(transaction);
      const result = await fn({ runner });
      await transaction.commit();
      return result;
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }
}