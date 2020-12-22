import { Transaction } from "sequelize";
import { InternalServerException } from "../../common/exceptions/types/internal-server.exception";
import { Language } from "../../common/i18n/consts/language.enum";
import { InternalServerExceptionLang } from "../../common/i18n/packs/internal-server-exception.lang";
import { IUniversalServices } from "../../common/interfaces/universal.services.interface";
import { OrPromise } from "../../common/types/or-promise.type";


export type IQueryAwaiterType = string | number | symbol;
export interface IQueryAwaiter {
  type: IQueryAwaiterType;
  handle(universal: IUniversalServices): OrPromise<void>;
}
interface IQueryRunnerAwaiterMessages {
  values: IQueryAwaiter[];
  types: Set<IQueryAwaiterType>;
}


export class QueryRunner {
  protected readonly _afterCommits: (() => Promise<any>)[] = [];
  protected _isCommitted = false;

  protected _awaiting?: IQueryRunnerAwaiterMessages;
  protected get awaiting(): IQueryRunnerAwaiterMessages {
    if (this._awaiting) return this._awaiting;
    this._awaiting = { values: [], types: new Set(), };
    return this._awaiting;
  }


  constructor(
    public readonly transaction: Transaction,
    protected readonly universal: IUniversalServices,
  ) {
    //
  }


  /**
   * Run each afterCommit hook
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async runAfterCommitHooks(): Promise<any> {
    this._isCommitted = true;
    // run all after-commit hooks...
    for (const after of this._afterCommits) {
      await after();
    }
    // fire all messages...
    const messages = this._awaiting;
    if (!messages) return;
    for (const value of messages.values) {
      await value.handle(this.universal);
    }
  }

  /**
   * Verify that the runner is in a valid state to do stuff on...
   */
  checkState(): void | never {
    if (this._isCommitted) {
      const lang = InternalServerExceptionLang.TransactionAlreadyCommitted[Language.En]
      throw new InternalServerException(lang);
    }
  }


  /**
   * Add an after commit hook
   *
   * @param fn
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  afterCommit(fn: (() => Promise<any>)): void {
    this.checkState();
    this._afterCommits.push(fn);
  }


  /**
   * Add an awaiter to be ran after commit
   */
  addAwaiter(message: IQueryAwaiter): void {
    this.checkState();
    const { values, types, } = this.awaiting;
    values.push(message);
    types.add(message.type);
  }

  /**
   * Add an awaiter unless it's type already there
   */
  addUniqueAwaiter(message: IQueryAwaiter): boolean {
    this.checkState();
    const { values, types, } = this.awaiting;
    if (types.has(message.type)) return false;
    values.push(message);
    types.add(message.type);
    return true;
  }
}
