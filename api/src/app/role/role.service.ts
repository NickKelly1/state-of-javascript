import { RoleModel } from '../../circle';
import { BadRequestException } from '../../common/exceptions/types/bad-request.exception';
import { ist } from '../../common/helpers/ist.helper';
import { RoleLang } from './role.lang';
import { QueryRunner } from '../db/query-runner';
import { RoleField } from './role.attributes';
import { RolePermissionModel } from '../role-permission/role-permission.model';
import { PermissionModel } from '../permission/permission.model';
import { Combinator } from '../../common/helpers/combinator.helper';
import { IRoleServiceCreateRoleDto } from './dto/role-service-create-role.dto';
import { IRoleServiceUpdateRoleDto } from './dto/role-service-update-role.dto';
import { BaseContext } from '../../common/context/base.context';
import { SocketMessageType } from '../socket/socket.message';
import { SocketMessageAwaiter } from '../socket/socket-message-awaiter';

export class RoleService {
  constructor(
    protected readonly ctx: BaseContext,
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

    const [, rolePermissions] = await Promise.all([
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
      const message = this.ctx.lang(RoleLang.AlreadyExists({ name: dto.name }));
      throw new BadRequestException(message, { [RoleField.name]: [message] });
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
  }): Promise<RoleModel> {
    const { model, dto, runner } = arg;
    const { transaction } = runner;
    if (ist.notUndefined(dto.name)) model.name = dto.name;
    await model.save({ transaction });
    runner.addUniqueAwaiter(new SocketMessageAwaiter({
      type: SocketMessageType.permissions_updated,
      payload: undefined,
    }));
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
    runner.addUniqueAwaiter(new SocketMessageAwaiter({
      type: SocketMessageType.permissions_updated,
      payload: undefined,
    }));
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
    runner.addUniqueAwaiter(new SocketMessageAwaiter({
      type: SocketMessageType.permissions_updated,
      payload: undefined,
    }));
    return model;
  }


  /**
   * Restore delete a role
   *
   * @param arg
   */
  async restore(arg: {
    model: RoleModel;
    runner: QueryRunner;
  }): Promise<RoleModel> {
    const { model, runner, } = arg;
    const { transaction } = runner;
    await model.restore({ transaction, });
    return model;
  }
}
