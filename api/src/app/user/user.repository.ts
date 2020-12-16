/* eslint-disable no-cond-assign */
import { FindOptions, Model, ModelCtor, Op, Order } from "sequelize";
import { BaseRepository } from "../../common/classes/repository.base";
import { InternalServerException } from "../../common/exceptions/types/internal-server.exception";
import { NotFoundException } from "../../common/exceptions/types/not-found.exception";
import { andWhere } from "../../common/helpers/and-where.helper.ts";
import { InternalServerExceptionLang } from "../../common/i18n/packs/internal-server-exception.lang";
import { UserLang } from "../../common/i18n/packs/user.lang";
import { OrNull } from "../../common/types/or-null.type";
import { OrUndefined } from "../../common/types/or-undefined.type";
import { QueryRunner } from "../db/query-runner";
import { UserPasswordModel } from "../user-password/user-password.model";
import { UserField } from "./user.attributes";
import { UserModel } from "./user.model";



export class UserRepository extends BaseRepository<UserModel> {
  protected readonly Model = UserModel as ModelCtor<UserModel>;


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
}
