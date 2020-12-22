import { FindOptions, Model, ModelCtor, Op } from "sequelize";
import { UserPasswordModel } from "../../circle";
import { BaseRepository } from "../../common/classes/base.repository";
import { andWhere } from "../../common/helpers/and-where.helper.ts";
import { OrNull } from "../../common/types/or-null.type";
import { QueryRunner } from "../db/query-runner";
import { UserTokenField } from "./user-token.attributes";
import { UserTokenModel } from "./user-token.model";


export class UserTokenRepository extends BaseRepository<UserTokenModel> {
  protected readonly Model = UserTokenModel as ModelCtor<UserTokenModel>;

  async findOneBySlugOrFail(
    slug: string,
    arg: {
      runner: OrNull<QueryRunner>,
      options?: Omit<FindOptions<UserTokenModel['_attributes']>, 'transaction'>
      unscoped?: boolean;
    }
  ): Promise<UserTokenModel> {
    const model = await this.findOneOrfail({
      ...arg,
      options: {
        ...arg.options,
        where: andWhere([
          { [UserTokenField.slug]: { [Op.eq]: slug, }, },
          arg.options?.where,
        ]),
      },
    });
    return model;
  }
}