import { Op } from 'sequelize';
import { RoleModel, UserModel, UserRoleModel } from '../../circle';
import { BadRequestException } from '../../common/exceptions/types/bad-request.exception';
import { auditableRo } from '../../common/helpers/auditable-ro.helper';
import { UserRoleLang } from '../../common/i18n/packs/user-role.lang';
import { IRequestContext } from '../../common/interfaces/request-context.interface';
import { QueryRunner } from '../db/query-runner';
import { IUserRoleRo } from './dtos/user-role.ro';
import { UserRoleField } from './user-role.attributes';

export class UserRoleService {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  async create(arg: {
    runner: QueryRunner;
    user: UserModel,
    role: RoleModel,
  }): Promise<UserRoleModel> {
    const { runner, user, role } = arg;
    const { transaction } = runner;

    const existing = await UserRoleModel.findOne({ where: {
      [Op.and]: {
        [UserRoleField.user_id]: user.id,
        [UserRoleField.role_id]: role.id,
      }
    }, transaction });
    if (existing) {
      const nameViolation = this.ctx.except(BadRequestException({
        message: this.ctx.lang(UserRoleLang.AlreadyExists({ role, user, }))
      }));
      throw nameViolation
    }

    const userRole = UserRoleModel.build({
      role_id: role.id,
      user_id: user.id,
    });

    await userRole.save({ transaction });
    return userRole;
  }


  async delete(arg: {
    model: UserRoleModel;
    runner: QueryRunner;
  }): Promise<UserRoleModel> {
    const { model, runner } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction });
    return model;
  }

  toRo(arg: {
    model: UserRoleModel,
  }): IUserRoleRo {
    const { model } = arg;
    return {
      id: model.id,
      role_id: model.role_id,
      user_id: model.user_id,
      ...auditableRo(model),
    };
  }
}
