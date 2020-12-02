import { Transaction } from "sequelize";


export class QueryRunner {
  protected readonly _afterCommits: (() => Promise<any>)[] = [];


  constructor(
    public readonly transaction: Transaction
  ) {
    //
  }


  /**
   * Run each afterCommit hook
   */
  async runAfterCommitHooks(): Promise<any> {
    for (const after of this._afterCommits) {
      // run hook...
      await after();
    }
  }


  /**
   * Add an after commit hook
   *
   * @param fn
   */
  afterCommit(fn: (() => Promise<any>)) {
    this._afterCommits.push(fn);
  }
}
