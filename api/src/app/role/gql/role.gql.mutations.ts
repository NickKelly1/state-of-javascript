import { GraphQLBoolean, GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { Op } from "sequelize";
import { RoleModel, UserModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { ForbiddenException } from "../../../common/exceptions/types/forbidden.exception";
import { NotFoundException } from "../../../common/exceptions/types/not-found.exception";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { ist } from "../../../common/helpers/ist.helper";
import { prettyQ } from "../../../common/helpers/pretty.helper";
import { PermissionLang } from "../../../common/i18n/packs/permission.lang";
import { RoleLang } from "../../../common/i18n/packs/role.lang";
import { logger } from "../../../common/logger/logger";
import { QueryRunner } from "../../db/query-runner";
import { PermissionId } from "../../permission/permission-id.type";
import { PermissionField } from "../../permission/permission.attributes";
import { Permission } from "../../permission/permission.const";
import { PermissionModel } from "../../permission/permission.model";
import { RolePermissionModel } from "../../role-permission/role-permission.model";
import { IRoleServiceUpdateRoleDto } from "../dto/role-service-update-role.dto";
import { CreateRoleGqlInput, CreateRoleValidator } from "../gql-input/create-role.gql";
import { DeleteRoleGqlInput, DeleteRoleValidator } from "../gql-input/delete-role.gql";
import { UpdateRoleGqlInput, UpdateRoleValidator } from "../gql-input/update-role.gql";
import { RoleAssociation } from "../role.associations";
import { RoleGqlNode, IRoleGqlNodeSource } from "./role.gql.node";


export const RoleGqlMutations: Thunk<GraphQLFieldConfigMap<undefined, GqlContext>> = () => ({
  /**
   * Create a Role
   */
  createRole: {
    type: GraphQLNonNull(RoleGqlNode),
    args: { dto: { type: GraphQLNonNull(CreateRoleGqlInput) } },
    resolve: async (parent, args, ctx): Promise<IRoleGqlNodeSource> => {
      ctx.authorize(ctx.services.rolePolicy.canCreate());
      const dto = ctx.validate(CreateRoleValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
        const model = await ctx.services.roleService.create({ runner, dto });
        if (dto.permission_ids?.length) {
          await authorizeAndSyncrhoniseRolePermissions({
            runner,
            ctx,
            currentRolePermissions: [],
            permission_ids: dto.permission_ids,
            role: model,
          });
        }
        return model;
      });
      return model;
    },
  },


  /**
   * Update a Role
   */
  updateRole: {
    type: GraphQLNonNull(RoleGqlNode),
    args: { dto: { type: GraphQLNonNull(UpdateRoleGqlInput) } },
    resolve: async (parent, args, ctx): Promise<IRoleGqlNodeSource> => {
      const dto = ctx.validate(UpdateRoleValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const model: RoleModel = await ctx.services.roleRepository.findByPkOrfail(dto.id, {
          runner,
          options: {
            include: [{ association: RoleAssociation.rolePermissions }],
          },
        });
        const currentRolePermissions = assertDefined(model.rolePermissions);

        const serviceDto: IRoleServiceUpdateRoleDto = { name: dto.name, }
        if (Object.values(serviceDto).filter(ist.notUndefined).length > 0) {
          // only authorize "update" if actually updating...
          ctx.authorize(ctx.services.rolePolicy.canUpdate({ model }));
          await ctx.services.roleService.update({ runner, dto: serviceDto, model });
        }

        if (ist.notNullable(dto.permission_ids)) {
          await authorizeAndSyncrhoniseRolePermissions({
            runner,
            ctx,
            currentRolePermissions,
            permission_ids: dto.permission_ids,
            role: model,
          });
        }

        // TODO: public security hole where user can "show" role by making no changes...
        logger.warn('TODO: public security hole where user can "show" role by making no changes...');

        return model;
      });

      return final;
    },
  },


  /**
   * SoftDelete a Role
   */
  softDeleteRole: {
    type: GraphQLNonNull(GraphQLBoolean),
    args: { dto: { type: GraphQLNonNull(DeleteRoleGqlInput) } },
    resolve: async (parent, args, ctx): Promise<boolean> => {
      const dto = ctx.validate(DeleteRoleValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
        const model: RoleModel = await ctx.services.roleRepository.findByPkOrfail(dto.id, {
          runner,
          options: {
            include: [{ association: RoleAssociation.rolePermissions }]
          }
        });
        ctx.authorize(ctx.services.rolePolicy.canSoftDelete({ model }));
        const rolePermissions = assertDefined(model.rolePermissions);
        await ctx.services.roleService.hardDelete({ runner, model, rolePermissions, });
        return model;
      });
      return true;
    },
  },


  /**
   * Restore a Role
   */
  restoreRole: {
    type: GraphQLNonNull(GraphQLBoolean),
    args: { dto: { type: GraphQLNonNull(DeleteRoleGqlInput) } },
    resolve: async (parent, args, ctx): Promise<boolean> => {
      const dto = ctx.validate(DeleteRoleValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
        const model: RoleModel = await ctx.services.roleRepository.findByPkOrfail(dto.id, {
          runner,
          options: {
            paranoid: true,
            include: [{ association: RoleAssociation.rolePermissions }]
          }
        });
        ctx.authorize(ctx.services.rolePolicy.canSoftDelete({ model }));
        const rolePermissions = assertDefined(model.rolePermissions);
        await ctx.services.roleService.hardDelete({ runner, model, rolePermissions, });
        return model;
      });
      return true;
    },
  },
});


/**
 * Synchronise desired role-permissions (with authorization)
 *
 * @param arg
 */
async function authorizeAndSyncrhoniseRolePermissions(arg: {
  currentRolePermissions: RolePermissionModel[],
  permission_ids: PermissionId[];
  runner: QueryRunner;
  role: RoleModel;
  ctx: GqlContext;
}): Promise<void> {
  const { runner, role, ctx, permission_ids, currentRolePermissions, } = arg;

  // fetch all
  const allPermissions = await ctx.services.permissionRepository.findAll({ runner, unscoped: true, });
  // extract & ensure all desired permissions exist
  const allPermissionsMap = new Map(allPermissions.map(permission => [ permission.id, permission, ]));
  const desiredPermissionsMap: Map<PermissionId, PermissionModel> = new Map();
  const notFoundPermissionIds: PermissionId[] = [];
  permission_ids.forEach(permission_id => {
    const permission = allPermissionsMap.get(permission_id);
    if (permission) desiredPermissionsMap.set(permission_id, permission);
    else notFoundPermissionIds.push(permission_id);
  });
  if (notFoundPermissionIds.length) {
    throw ctx.except(NotFoundException({ message: ctx.lang(PermissionLang.NotFound({ ids: notFoundPermissionIds })) }));
  }

  // find missing & unexpected permissions from the role
  const {
    missing,
    unexpected,
  } = ctx
    .services
    .roleService
    .diffRolePermissions({
      current: currentRolePermissions,
      desired: Array.from(desiredPermissionsMap.values()),
    });

  // verify missing permissions can be created
  const forbiddenFromCreating = missing.filter(permission => !ctx
    .services
    .rolePermissionPolicy
    .canCreate({ permission, role }));

  if (forbiddenFromCreating.length) {
    throw ctx.except(ForbiddenException({
      message: ctx.lang(RoleLang.ForbiddenAddingPermissions({
        roleName: role.name,
        permisionNames: forbiddenFromCreating.map(perm => perm.name),
      })),
    }));
  }

  // verify unexpected permissions can be deleted
  const forbiddenFromDeleting = unexpected.filter(rolePermission => !ctx
    .services
    .rolePermissionPolicy
    .canHardDelete({
      model: rolePermission,
      permission: assertDefined(allPermissionsMap.get(rolePermission.permission_id)),
      role,
    }));

  if (forbiddenFromDeleting.length) {
    throw ctx.except(ForbiddenException({
      message: ctx.lang(RoleLang.ForbiddenDeletingPermissions({
        roleName: role.name,
        permisionNames: forbiddenFromDeleting.map(rolePermission => assertDefined(allPermissionsMap.get(rolePermission.permission_id)).name),
      })),
    }));
  }

  // do create
  await Promise.all(missing.map((permission) => ctx
    .services
    .rolePermissionService
    .create({ runner, permission, role, })));

  // do delete
  await Promise.all(unexpected.map((rolePermission) => ctx
    .services
    .rolePermissionService
    .delete({ model: rolePermission, runner, })));
}
