import { RoleModel } from '../../circle';
import { BadRequestException } from '../../common/exceptions/types/bad-request.exception';
import { auditableRo } from '../../common/helpers/auditable-ro.helper';
import { ist } from '../../common/helpers/ist.helper';
import { softDeleteableRo } from '../../common/helpers/soft-deleteable-ro.helper';
import { RoleLang } from '../../common/i18n/packs/role.lang';
import { IRequestContext } from '../../common/interfaces/request-context.interface';
import { QueryRunner } from '../db/query-runner';
import { ICreateRoleGqlInput } from './gql-input/create-role.gql';
import { RoleField } from './role.attributes';
import { RolePermissionModel } from '../role-permission/role-permission.model';
import { IUpdateRoleGqlInput } from './gql-input/update-role.gql';
import { PermissionModel } from '../permission/permission.model';
import { Combinator } from '../../common/helpers/combinator.helper';
import { IRoleServiceCreateRoleDto } from './dto/role-service-create-role.dto';
import { IRoleServiceUpdateRoleDto } from './dto/role-service-update-role.dto';

export class RoleService {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }


  /**
   * Find unexpected or missing RolePermissions & Permissions
   *
   * @param arg
   */
  diffRolePermissions(arg: {
    current: RolePermissionModel[];
    desired: PermissionModel[];
  }): {
    missing: PermissionModel[];
    unexpected: RolePermissionModel[];
    normal: RolePermissionModel[];
  } {
    const { current, desired } = arg;
    const combinator = new Combinator({
      // a => previous
      a: new Map(current.map(rp => [rp.permission_id, rp])),
      // b => next
      b: new Map(desired.map(perm => [perm.id, perm])),
    });
    // in previous but not next
    const unexpected = Array.from(combinator.diff.aNotB.values());
    // in next but not previous
    const missing = Array.from(combinator.diff.bNotA.values());
    // normal role-permissions
    const normal = Array.from(combinator.bJoinA.a.values());

    return {
      unexpected,
      missing,
      normal,
    };
  }


  /**
   * Sync the role-permissions of a role
   *
   * @param arg
   */
  async syncRolePermissions(arg: {
    runner: QueryRunner;
    role: RoleModel;
    prevRolePermissions: RolePermissionModel[];
    nextPermissions: PermissionModel[];
  }): Promise<RolePermissionModel[]> {
    const { runner, nextPermissions, prevRolePermissions, role } = arg;
    const { transaction } = runner;

    const combinator = new Combinator({
      // a => previous
      a: new Map(prevRolePermissions.map(rp => [rp.permission_id, rp])),
      // b => next
      b: new Map(nextPermissions.map(perm => [perm.id, perm])),
    });
    // in previous but not next
    const unexpected = Array.from(combinator.diff.aNotB.values());
    // in next but not previous
    const missing = Array.from(combinator.diff.bNotA.values());
    // already exist
    const normal = Array.from(combinator.bJoinA.a.values());

    const [_, rolePermissions] = await Promise.all([
      Promise.all(unexpected.map(staleRolePermission => staleRolePermission.destroy({ transaction }))),
      Promise.all(missing.map(async (permission) => {
        const rp = await this
          .ctx
          .services
          .rolePermissionService
          .create({ role, permission, runner });
        return rp;
      })),
    ]);

    return rolePermissions;
  }


  /**
   * Create a role
   *
   * @param arg
   */
  async create(arg: {
    runner: QueryRunner;
    dto: IRoleServiceCreateRoleDto;
  }): Promise<RoleModel> {
    const { dto, runner } = arg;
    const { transaction } = runner;

    const existing = await RoleModel.findOne({ where: { [RoleField.name]: dto.name }, transaction });
    if (existing) {
      const nameViolation = this.ctx.except(BadRequestException({
        data: { [RoleField.name]: [this.ctx.lang(RoleLang.AlreadyExists({ name: dto.name }))] }
      }));
      throw nameViolation
    }

    const role = RoleModel.build({
      name: dto.name,
    });

    await role.save({ transaction });

    return role;
  }


  /**
   * Update a role
   *
   * @param arg
   */
  async update(arg: {
    runner: QueryRunner;
    model: RoleModel;
    dto: IRoleServiceUpdateRoleDto;
  }) {
    const { model, dto, runner } = arg;
    const { transaction } = runner;
    if (ist.notUndefined(dto.name)) model.name = dto.name;
    await model.save({ transaction });
    return model;
  }

  /**
   * Soft delete a role
   *
   * @param arg
   */
  async softDelete(arg: {
    model: RoleModel;
    runner: QueryRunner;
  }): Promise<RoleModel> {
    const { model, runner } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction });
    return model;
  }


  /**
   * Hard delete a role
   *
   * @param arg
   */
  async hardDelete(arg: {
    model: RoleModel;
    rolePermissions: RolePermissionModel[];
    runner: QueryRunner;
  }): Promise<RoleModel> {
    const { model, runner, rolePermissions } = arg;
    const { transaction } = runner;
    await Promise.all(rolePermissions.map(rp => rp.destroy({ transaction })));
    await model.destroy({ transaction, force: true });
    return model;
  }
}
