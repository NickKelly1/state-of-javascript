/* eslint-disable no-cond-assign */
import { FindOptions, Includeable, ModelCtor, Op, Order, WhereOptions } from "sequelize";
import { BaseRepository } from "../../common/classes/base.repository";
import { InternalServerException } from "../../common/exceptions/types/internal-server.exception";
import { NotFoundException } from "../../common/exceptions/types/not-found.exception";
import { IGqlArgs } from "../../common/gql/gql.query.arg";
import { andWhere } from "../../common/helpers/and-where.helper.ts";
import { concatIncludables } from "../../common/helpers/concat-includables.helper";
import { LangSwitch } from "../../common/i18n/helpers/lange-match.helper";
import { InternalServerExceptionLang } from "../../common/i18n/packs/internal-server-exception.lang";
import { collectionMeta } from "../../common/responses/collection-meta";
import { OrArray } from "../../common/types/or-array.type";
import { OrNull } from "../../common/types/or-null.type";
import { OrNullable } from "../../common/types/or-nullable.type";
import { OrUndefined } from "../../common/types/or-undefined.type";
import { QueryRunner } from "../db/query-runner";
import { IUserCollectionGqlNodeSource } from "./gql/user.collection.gql.node";
import { UserField } from "./user.attributes";
import { UserModel } from "./user.model";
import { UserLang } from './user.lang';

export class UserRepository extends BaseRepository<UserModel> {
  protected readonly Model = UserModel as ModelCtor<UserModel>;


  /**
   * @inheritdoc
   */
  notFoundLang(): LangSwitch {
    return UserLang.NotFound;
  }


  /**
   * @inheritdoc
   */
  order(): OrUndefined<Order> {
    return [
      [UserField.id, 'ASC'],
    ];
  }


  /**
   * Find a user by its email / name (or fail)
   *
   * @param arg
   */
  async findOneFromNameEmailOrFail(arg: {
    runner: QueryRunner,
    nameOrEmail: string;
    options?: Omit<FindOptions<UserModel['_attributes']>, 'transaction'>,
    unscoped?: boolean;
  }): Promise<OrNull<UserModel>> {
    const result = await this.findOneFromNameEmail(arg);
    if (!result) {
      const message = this.ctx.lang(UserLang.NotFound);
      throw new NotFoundException(message);
    }
    return result;
  }


  /**
   * Find a user by its email / name
   *
   * @param arg
   */
  async findOneFromNameEmail(arg: {
    runner: QueryRunner,
    nameOrEmail: string;
    options?: Omit<FindOptions<UserModel['_attributes']>, 'transaction'>,
    unscoped?: boolean;
  }): Promise<OrNull<UserModel>> {
    const { runner, nameOrEmail, options, unscoped } = arg;
    const users = await this.findAll({
      runner,
      unscoped,
      options: {
        ...options,
        where: andWhere([
          options?.where,
          { [Op.or]: [
            { [UserField.name]: { [Op.eq]: nameOrEmail }},
            { [UserField.email]: { [Op.eq]: nameOrEmail }},
          ] },
        ]),
      },
    });

    // found none
    if (users.length === 0) {
      return null;
    }

    // found 1
    else if (users.length === 1) {
      return users[0];
    }

    // found > 1
    let match: OrUndefined<UserModel>;
    // match email
    if (match = users.find(usr => usr.email === nameOrEmail)) return match;
    // match name
    else if (match = users.find(usr => usr.name === nameOrEmail)) return match;
    // no match js match, but yes sql match...?
    const message = this.ctx.lang(InternalServerExceptionLang.FailedToFindUser);
    throw new InternalServerException(message);
  }


  /**
   * Find a GraphQL Collection of User
   */
  async gqlCollection(arg: {
    runner: OrNull<QueryRunner>;
    args: IGqlArgs;
    where?: OrNullable<WhereOptions<UserModel['_attributes']>>,
    include?: OrNullable<OrArray<Includeable>>,
  }): Promise<IUserCollectionGqlNodeSource> {
    const { ctx } = this;
    const { runner, args, where, include, } = arg;
    const { page, queryOptions } = this.transformGqlCollectionQuery({ args, });
    const { rows, count } = await ctx.services.userRepository.findAllAndCount({
      runner,
      options: {
        ...queryOptions,
        where: andWhere([
          where,
          queryOptions.where,
        ]),
        include: concatIncludables([
          include,
          queryOptions.include,
        ]),
      },
    });
    const pagination = collectionMeta({ data: rows, total: count, page });
    const collection: IUserCollectionGqlNodeSource = {
      models: rows.map((model): OrNull<UserModel> =>
        ctx.services.userPolicy.canFindOne({ model })
          ? model
          : null
        ),
      pagination,
    };
    return collection;
  }
}
