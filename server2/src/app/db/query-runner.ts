import { Transaction } from "sequelize";


export class QueryRunner {
  constructor(
    public readonly transaction: Transaction
  ) {
    //
  }
}
