import { Transaction } from "sequelize/types";


export class QueryRunner {
  constructor(
    public readonly transaction: Transaction
  ) {
    //
  }
}
