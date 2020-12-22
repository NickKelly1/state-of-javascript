import { GraphQLBoolean, GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { RoleModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { ForbiddenException } from "../../../common/exceptions/types/forbidden.exception";
import { NotFoundException } from "../../../common/exceptions/types/not-found.exception";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { ist } from "../../../common/helpers/ist.helper";
import { PermissionLang } from "../../permission/permission.lang";
import { RoleLang } from "../role.lang";
import { QueryRunner } from "../../db/query-runner";
import { PermissionId } from "../../permission/permission-id.type";
import { PermissionModel } from "../../permission/permission.model";
import { RolePermissionModel } from "../../role-permission/role-permission.model";
import { IRoleServiceUpdateRoleDto } from "../dto/role-service-update-role.dto";
import { CreateRoleGqlInput, CreateRoleValidator } from "../gql-input/create-role.gql";
import { TargetRoleGqlInput, TargetRoleValidator } from "../gql-input/target-role.gql";
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
      // authorise access
      ctx.authorize(ctx.services.rolePolicy.canAccess(), RoleLang.CannotAccess);
      // authorise create
      ctx.authorize(ctx.services.rolePolicy.canCreate(), RoleLang.CannotCreate);
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
      // authorise access
      ctx.authorize(ctx.services.rolePolicy.canAccess(), RoleLang.CannotAccess);
      // validate
      const dto = ctx.validate(UpdateRoleValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        //find
        const model: RoleModel = await ctx.services.roleRepository.findByPkOrfail(dto.id, {
          runner,
          options: {
            include: [{ association: RoleAssociation.rolePermissions }],
          },
        });
        const currentRolePermissions = assertDefined(model.rolePermissions);
        // authorise view
        ctx.services.roleRepository._404Unless(ctx.services.rolePolicy.canFindOne({ model }));
        // authorise update
        const serviceDto: IRoleServiceUpdateRoleDto = { name: dto.name, }
        if (Object.values(serviceDto).filter(ist.notUndefined).length > 0) {
          // only authorize "update" if actually updating...
          ctx.authorize(
            ctx.services.rolePolicy.canUpdate({ model }),
            RoleLang.CannotUpdate({ role: model }),
          );
          // do update
          await ctx.services.roleService.update({ runner, dto: serviceDto, model });
        }
        // synchronise
        if (ist.notNullable(dto.permission_ids)) {
          await authorizeAndSyncrhoniseRolePermissions({
            runner,
            ctx,
            currentRolePermissions,
            permission_ids: dto.permission_ids,
            role: model,
          });
        }
        return model;
      });

      return final;
    },
  },


  /**
   * SoftDelete a Role
   */
  softDeleteRole: {
    type: GraphQLNonNull(RoleGqlNode),
    args: { dto: { type: GraphQLNonNull(TargetRoleGqlInput) } },
    resolve: async (parent, args, ctx): Promise<IRoleGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.rolePolicy.canAccess(), RoleLang.CannotAccess);
      // validate
      const dto = ctx.validate(TargetRoleValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const model: RoleModel = await ctx.services.roleRepository.findByPkOrfail(dto.id, { runner, });
        // authorise view
        ctx.services.roleRepository._404Unless(ctx.services.rolePolicy.canFindOne({ model }));
        // authorise soft-delete
        ctx.authorize(
          ctx.services.rolePolicy.canSoftDelete({ model }),
          RoleLang.CannotSoftDelete({ role: model }),
        );
        // do soft-delete
        await ctx.services.roleService.softDelete({ runner, model, });
        return model;
      });
      return final;
    },
  },


  /**
   * HardDelete a Role
   */
  hardDeleteRole: {
    type: GraphQLNonNull(GraphQLBoolean),
    args: { dto: { type: GraphQLNonNull(TargetRoleGqlInput) } },
    resolve: async (parent, args, ctx): Promise<boolean> => {
      // authorise access
      ctx.authorize(ctx.services.rolePolicy.canAccess(), RoleLang.CannotAccess);
      // validate
      const dto = ctx.validate(TargetRoleValidator, args.dto);
      await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const model: RoleModel = await ctx.services.roleRepository.findByPkOrfail(dto.id, {
          runner,
          options: {
            include: [{ association: RoleAssociation.rolePermissions }]
          }
        });
        // authorise view
        ctx.services.roleRepository._404Unless(ctx.services.rolePolicy.canFindOne({ model }));
        // authorise hard-delete
        ctx.authorize(
          ctx.services.rolePolicy.canHardDelete({ model }),
          RoleLang.CannotHardDelete({ role: model }),
        );
        const rolePermissions = assertDefined(model.rolePermissions);
        // do hard-delete
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
    type: GraphQLNonNull(RoleGqlNode),
    args: { dto: { type: GraphQLNonNull(TargetRoleGqlInput) } },
    resolve: async (parent, args, ctx): Promise<IRoleGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.rolePolicy.canAccess(), RoleLang.CannotAccess);
      // validate
      const dto = ctx.validate(TargetRoleValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const model: RoleModel = await ctx.services.roleRepository.findByPkOrfail(dto.id, {
          runner,
          options: { paranoid: true, }
        });
        // authorise view
        ctx.services.roleRepository._404Unless(ctx.services.rolePolicy.canFindOne({ model }));
        // authorise restore
        ctx.authorize(
          ctx.services.rolePolicy.canRestore({ model }),
          RoleLang.CannotRestore({ role: model }),
        );
        // do restore
        await ctx.services.roleService.restore({ runner, model, });
        return model;
      });
      return final;
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
    const message = ctx.lang(PermissionLang.IdsNotFound({ ids: notFoundPermissionIds }))
    throw new NotFoundException(message);
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
    const message = ctx.lang(RoleLang.ForbiddenAddingPermissions({
      roleName: role.name,
      permisionNames: forbiddenFromCreating.map(perm => perm.name),
    }));
    throw new ForbiddenException(message);
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
    const message = ctx.lang(RoleLang.ForbiddenDeletingPermissions({
      roleName: role.name,
      permisionNames: forbiddenFromDeleting.map(rolePermission => assertDefined(allPermissionsMap.get(rolePermission.permission_id)).name),
    }));
    throw new ForbiddenException(message);
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
    .hardDelete({ model: rolePermission, runner, })));
}
