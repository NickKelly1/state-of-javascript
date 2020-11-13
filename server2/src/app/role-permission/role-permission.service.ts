import { Op } from 'sequelize';
import { RolePermissionModel } from '../../circle';
import { BadRequestException } from '../../common/exceptions/types/bad-request.exception';
import { assertDefined } from '../../common/helpers/assert-defined.helper';
import { auditableRo } from '../../common/helpers/auditable-ro.helper';
import { RolePermissionLang } from '../../common/i18n/packs/role-permission.lang';
import { IRequestContext } from '../../common/interfaces/request-context.interface';
import { QueryRunner } from '../db/query-runner';
import { PermissionId } from '../permission/permission-id.type';
import { PermissionModel } from '../permission/permission.model';
import { RoleId } from '../role/role.id.type';
import { RoleModel } from '../role/role.model';
import { IRolePermissionRo } from './dtos/role-permission.ro';
import { RolePermissionAssociation } from './role-permission.associations';
import { RolePermissionField } from './role-permission.attributes';

export class RolePermissionService {
  constructor(
    protected readonly ctx: IRequestContext,
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
    pairs: { role_id: RoleId; permission_id: PermissionId; }[],
  }) {
    const { runner, pairs, dataKey } = arg;

    // find constraint violations
    const existing = await this.ctx.services.rolePermissionRepository.findAll({
      runner,
      unscoped: true,
      options: {
        where: { [Op.or]: pairs.map(pair => ({
          [RolePermissionField.role_id]: pair.role_id,
          [RolePermissionField.permission_id]: pair.permission_id,
        })), },
        include: [
          { association: RolePermissionAssociation.role },
          { association: RolePermissionAssociation.user },
        ],
      },
    });

    // throw if violated
    if (existing.length) {
      const message = existing
        .map(exist => {
          const role = assertDefined(exist.role);
          const permission = assertDefined(exist.permission);
          return this.ctx.lang(RolePermissionLang.AlreadyExists({ role: role.name, permission: permission.name }));
        });
      throw this.ctx.except(BadRequestException({
        message: message.join('\n'),
        data: dataKey ? { [dataKey]: message } : undefined,
      }));
    }
  }


  /**
   * Create a new RolePermission
   *
   * @param arg
   */
  async create(arg: {
    runner: QueryRunner;
    role: RoleModel,
    permission: PermissionModel,
  }): Promise<RolePermissionModel> {
    const { runner, role, permission } = arg;
    const { transaction } = runner;

    const RolePermission = RolePermissionModel.build({
      role_id: role.id,
      permission_id: permission.id,
    });

    await RolePermission.save({ transaction });
    return RolePermission;
  }


  /**
   * Delete a RolePermission
   *
   * @param arg
   */
  async delete(arg: {
    model: RolePermissionModel;
    runner: QueryRunner;
  }): Promise<RolePermissionModel> {
    const { model, runner } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction });
    return model;
  }
}
