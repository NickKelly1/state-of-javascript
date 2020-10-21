import { FindOptions, Identifier, Model, Model as TModelAttributes, ModelCtor, Op, WhereOptions } from "sequelize";
import { QueryRunner } from "../../app/db/query-runner";
import { NotFoundException } from "../exceptions/types/not-found.exception";
import { ist } from "../helpers/is.helper";
import { IRequestContext } from "../interfaces/request-context.interface";
import { IRowsWithCount } from "../interfaces/rows-with-count.interface";
import { OrNull } from "../types/or-null.type";
import { OrNullable } from "../types/or-nullable.type";
import { OrUndefined } from "../types/or-undefined.type";

export abstract class BaseRepository<M extends Model<any, any>> {
  protected abstract readonly Model: ModelCtor<M>;
  constructor(protected readonly ctx: IRequestContext) {
    //
  }

  /**
   * Default dynamic scope for queries
   * Overridable
   * Can reference the ctx
   */
  protected scope(): OrUndefined<WhereOptions<M['_attributes']>> {
    return undefined;
  }


  /**
   * Build an sequelize where clause
   *
   * @param wheres
   */
  protected buildWhere(
    wheres?: OrNullable<WhereOptions<M['_attributes']>>[],
    options?: { unscoped?: boolean },
  ): OrUndefined<WhereOptions<M['_attributes']>> {
    const unscoped = options?.unscoped;
    const definedWheres = wheres?.filter(ist.notNullable) ?? [];
    const scope = unscoped ? undefined : this.scope?.();

    if (definedWheres.length) {
      if (scope) {
        // both
        return { [Op.and]: [...definedWheres, scope] };
      }

      if (definedWheres.length > 1) {
        // more than 1 where
        return { [Op.and]: definedWheres };
      }

      // only 1 where
      return definedWheres[0];
    }

    // only scope
    if (scope) {
      return scope;
    }

    // neither
    return undefined;
  }


  /**
   * Find all
   *
   * @param arg
   */
  async findAll(arg: {
    runner: OrNull<QueryRunner>,
    options?: Omit<FindOptions<M['_attributes']>, 'transaction'>,
    unscoped?: boolean;
  }): Promise<M[]> {
    const { runner, options, unscoped } = arg;
    const transaction = runner?.transaction;
    const { where: optionsWhere, ...otherFindOpts } = options ?? {};
    const where = this.buildWhere([optionsWhere], { unscoped });
    const result = await this.Model.findAll({ ...otherFindOpts, transaction, where, });
    return result;
  }


  /**
   * Find all (and count)
   *
   * @param arg
   */
  async findAllAndCount(arg: {
    runner: OrNull<QueryRunner>,
    options?: Omit<FindOptions<M['_attributes']>, 'transaction'>,
    unscoped?: boolean;
  }): Promise<IRowsWithCount<M>> {
    const { runner, options, unscoped } = arg;
    const transaction = runner?.transaction;
    const { where: optionsWhere, ...otherFindOpts } = options ?? {};
    const where = this.buildWhere([optionsWhere], { unscoped });
    const result = await this.Model.findAndCountAll({ ...otherFindOpts, transaction, where, });
    return result;
  }


  /**
   * Find one by primary key
   * 
   * @param pk
   * @param arg
   */
  async findByPk(
    pk: Identifier,
    arg: {
      runner: OrNull<QueryRunner>,
      options?: Omit<FindOptions<M['_attributes']>, 'transaction'>
      unscoped?: boolean;
    },
  ): Promise<OrNull<M>> {
    const { runner, options, unscoped } = arg;
    const transaction = runner?.transaction;
    const { where: optionsWhere, ...otherFindOpts } = options ?? {};
    const pkField = this.Model.primaryKeyAttribute;
    const pkWhere: WhereOptions = { [pkField]: { [Op.eq]: pk } };
    const where = this.buildWhere([optionsWhere, pkWhere], { unscoped });
    const result = await this.Model.findOne({ ...otherFindOpts, transaction, where, });
    return result;
  }


  /**
   * Find one or throw
   *
   * @param pk
   * @param arg
   */
  async findByPkOrfail(
    pk: Identifier,
    arg: {
      runner: OrNull<QueryRunner>,
      options?: Omit<FindOptions<M['_attributes']>, 'transaction'>
      unscoped?: boolean;
    },
  ): Promise<M> {
    const result = await this.findByPk(pk, arg);
    if (!result) throw this.ctx.except(NotFoundException());
    return result;
  }


  /**
   * Find one
   *
   * @param arg
   */
  async findOne(arg: {
    runner: OrNull<QueryRunner>,
    options?: Omit<FindOptions<M['_attributes']>, 'transaction'>
    unscoped?: boolean;
  }): Promise<OrNull<M>> {
    const { runner, options, unscoped } = arg;
    const transaction = runner?.transaction;
    const { where: optionsWhere, ...otherFindOpts } = options ?? {};
    const where = this.buildWhere([optionsWhere], { unscoped });
    const result = await this.Model.findOne({ ...otherFindOpts, transaction, where, });
    return result;
  }


  /**
   * Find one or throw
   *
   * @param arg
   */
  async findOneOrfail(arg: {
    runner: OrNull<QueryRunner>,
    options?: Omit<FindOptions<M['_attributes']>, 'transaction'>
    unscoped?: boolean;
  }): Promise<M> {
    const result = await this.findOne(arg);
    if (!result) throw this.ctx.except(NotFoundException());
    return result;
  }
}
