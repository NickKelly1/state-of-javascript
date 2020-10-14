import { Op } from 'sequelize';
import { RolePermissionModel } from '../../circle';
import { BadRequestException } from '../../common/exceptions/types/bad-request.exception';
import { auditableRo } from '../../common/helpers/auditable-ro.helper';
import { RolePermissionLang } from '../../common/i18n/packs/role-permission.lang';
import { IRequestContext } from '../../common/interfaces/request-context.interface';
import { QueryRunner } from '../db/query-runner';
import { PermissionModel } from '../permission/permission.model';
import { RoleModel } from '../role/role.model';
import { IRolePermissionRo } from './dtos/role-permission.ro';
import { RolePermissionField } from './role-permission.attributes';

export class RolePermissionService {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  async create(arg: {
    runner: QueryRunner;
    role: RoleModel,
    permission: PermissionModel,
  }): Promise<RolePermissionModel> {
    const { runner, role, permission } = arg;
    const { transaction } = runner;

    const existing = await RolePermissionModel.findOne({ where: {
      [Op.and]: {
        [RolePermissionField.role_id]: role.id,
        [RolePermissionField.permission_id]: permission.id,
      }
    }, transaction });
    if (existing) {
      const nameViolation = this.ctx.except(BadRequestException({
        message: this.ctx.lang(RolePermissionLang.AlreadyExists({ role, permission, })),
      }));
      throw nameViolation
    }

    const RolePermission = RolePermissionModel.build({
      role_id: role.id,
      permission_id: permission.id,
    });

    await RolePermission.save({ transaction });
    return RolePermission;
  }


  async delete(arg: {
    model: RolePermissionModel;
    runner: QueryRunner;
  }): Promise<RolePermissionModel> {
    const { model, runner } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction });
    return model;
  }


  toRo(arg: {
    model: RolePermissionModel,
  }): IRolePermissionRo {
    const { model } = arg;
    return {
      id: model.id,
      role_id: model.permission_id,
      permission_id: model.permission_id,
      ...auditableRo(model),
    };
  }
}
