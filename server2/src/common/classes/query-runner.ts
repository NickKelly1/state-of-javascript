import { Sequelize, Transaction } from "sequelize/types";
import { sequelize } from "../../db/sequelize";
import { OrUndefined } from "../types/or-undefined.type";


export interface ITransactFnArg {
  seq: Sequelize;
  runner: QueryRunner;
}

export class QueryRunner {
  constructor(
    public readonly transaction: Transaction
  ) {
    //
  }

  static async transact<T>(fn: (arg: ITransactFnArg) => Promise<T>): Promise<T> {
    const seq = sequelize;
    let transaction: OrUndefined<Transaction>;
    try {
      transaction = await seq.transaction();
      const runner = new QueryRunner(transaction);
      const result = await fn({ runner, seq });
      await transaction.commit();
      return result;
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }
}
