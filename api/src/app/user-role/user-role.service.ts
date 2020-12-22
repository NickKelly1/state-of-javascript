import { Op } from 'sequelize';
import { RoleModel, UserModel, UserRoleModel } from '../../circle';
import { BaseContext } from '../../common/context/base.context';
import { BadRequestException } from '../../common/exceptions/types/bad-request.exception';
import { assertDefined } from '../../common/helpers/assert-defined.helper';
import { UserRoleLang } from '../../common/i18n/packs/user-role.lang';
import { QueryRunner } from '../db/query-runner';
import { RoleId } from '../role/role.id.type';
import { UserId } from '../user/user.id.type';
import { UserRoleAssociation } from './user-role.associations';
import { UserRoleField } from './user-role.attributes';

export class UserRoleService {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }


  /**
   * Check that the creations don't violate constraints
   *
   * @param arg
   */
  async checkConstraints(arg: {
    runner: QueryRunner
    dataKey?: string;
    pairs: { user_id: UserId; role_id: RoleId; }[],
  }): Promise<void> {
    const { runner, pairs, dataKey } = arg;

    // find constraint violations
    const existing = await this.ctx.services.userRoleRepository.findAll({
      runner,
      unscoped: true,
      options: {
        where: { [Op.or]: pairs.map(pair => ({
          [UserRoleField.user_id]: pair.user_id,
          [UserRoleField.role_id]: pair.role_id,
        })), },
        include: [
          { association: UserRoleAssociation.role },
          { association: UserRoleAssociation.user },
        ],
      },
    });

    // throw if violated
    if (existing.length) {
      const messages = existing
        .map(exist => {
          const user = assertDefined(exist.user);
          const role = assertDefined(exist.role);
          return this.ctx.lang(UserRoleLang.AlreadyExists({ role: role.name, user: user.name }));
        });
      const message  = messages.join('\n');
      throw new BadRequestException(message, dataKey ? { [dataKey]: messages } : undefined);
    }
  }


  /**
   * Create a user role
   *
   * @param arg
   */
  async create(arg: {
    runner: QueryRunner;
    user: UserModel,
    role: RoleModel,
  }): Promise<UserRoleModel> {
    const { runner, user, role } = arg;
    const { transaction } = runner;

    const userRole = UserRoleModel.build({
      role_id: role.id,
      user_id: user.id,
    });

    await userRole.save({ transaction });
    return userRole;
  }


  /**
   * Delete a user role
   *
   * @param arg
   */
  async delete(arg: {
    model: UserRoleModel;
    runner: QueryRunner;
  }): Promise<UserRoleModel> {
    const { model, runner } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction });
    return model;
  }
}
