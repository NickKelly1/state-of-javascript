import { Op } from 'sequelize';
import { RolePermissionModel } from '../../circle';
import { BaseContext } from '../../common/context/base.context';
import { BadRequestException } from '../../common/exceptions/types/bad-request.exception';
import { assertDefined } from '../../common/helpers/assert-defined.helper';
import { RolePermissionLang } from './role-permission.lang';
import { QueryRunner } from '../db/query-runner';
import { PubsubMessageAwaiter } from '../db/pubsub-message-awaiter';
import { PermissionId } from '../permission/permission-id.type';
import { PermissionModel } from '../permission/permission.model';
import { RoleId } from '../role/role.id.type';
import { RoleModel } from '../role/role.model';
import { RolePermissionAssociation } from './role-permission.associations';
import { RolePermissionField } from './role-permission.attributes';
import { Role } from '../role/role.const';
import { RedisChannel } from '../db/redis.channel.const';
import { SocketMessageType } from '../socket/socket.message';
import { SocketMessageAwaiter } from '../socket/socket-message-awaiter';

export class RolePermissionService {
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
    pairs: { role_id: RoleId; permission_id: PermissionId; }[],
  }): Promise<void> {
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
      const messages = existing
        .map(exist => {
          const role = assertDefined(exist.role);
          const permission = assertDefined(exist.permission);
          return this.ctx.lang(RolePermissionLang.AlreadyExists({ role: role.name, permission: permission.name }));
        })
      const message = messages.join('\n');
      throw new BadRequestException(message, dataKey ? { [dataKey]: messages } : undefined,);
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

    const model = RolePermissionModel.build({
      role_id: role.id,
      permission_id: permission.id,
    });

    await model.save({ transaction });

    if (model.role_id === Role.Admin
      || model.role_id == Role.Authenticated
      || model.role_id === Role.Public
    ) {
      // publish redis
      runner.addUniqueAwaiter(new PubsubMessageAwaiter({
        type: RedisChannel.sys_permissions.name,
        message: RedisChannel.sys_permissions.messages.updated,
      }));
    }

    // notify sockets
    runner.addUniqueAwaiter(new SocketMessageAwaiter({
      type: SocketMessageType.permissions_updated,
      payload: undefined,
    }));

    return model;
  }


  /**
   * Delete a RolePermission
   *
   * @param arg
   */
  async hardDelete(arg: {
    model: RolePermissionModel;
    runner: QueryRunner;
  }): Promise<RolePermissionModel> {
    const { model, runner } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction });

    if (model.role_id === Role.Admin
      || model.role_id == Role.Authenticated
      || model.role_id === Role.Public
    ) {
      // publish redis
      runner.addUniqueAwaiter(new PubsubMessageAwaiter({
        type: RedisChannel.sys_permissions.name,
        message: RedisChannel.sys_permissions.messages.updated,
      }));
    }

    // notify sockets
    runner.addUniqueAwaiter(new SocketMessageAwaiter({
      type: SocketMessageType.permissions_updated,
      payload: undefined,
    }));

    return model;
  }
}
