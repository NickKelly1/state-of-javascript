import { GraphQLBoolean, GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { RolePermissionModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { CreateRolePermissionGqlInput, CreateRolePermissionValidator } from "../dtos/create-role-permission.gql";
import { DeleteRolePermissionGqlInput, DeleteRolePermissionValidator } from "../dtos/delete-role-permission.gql";
import { RolePermissionAssociation } from "../role-permission.associations";
import { RolePermissionLang } from "../role-permission.lang";
import { IRolePermissionGqlNodeSource, RolePermissionGqlNode } from "./role-permission.gql.node";

export const RolePermissionGqlMutations: Thunk<GraphQLFieldConfigMap<undefined, GqlContext>> = () => ({
  /**
   * Create RolePermission
   */
  createRolePermission: {
    type: GraphQLNonNull(RolePermissionGqlNode),
    args: { dto: { type: GraphQLNonNull(CreateRolePermissionGqlInput) } },
    resolve: async (parent, args, ctx): Promise<IRolePermissionGqlNodeSource> => {
      // authorise access
      ctx.authorize( ctx.services.rolePermissionPolicy.canAccess(), RolePermissionLang.CannotCreate,);
      // validate
      const dto = ctx.validate(CreateRolePermissionValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        await ctx
          .services
          .rolePermissionService
          .checkConstraints({
            runner,
            pairs: [{ permission_id: dto.permission_id, role_id: dto.role_id }],
            dataKey: 'role_id',
          });
        const [role, permission] = await Promise.all([
          ctx
            .services
            .roleRepository
            .findByPkOrfail(dto.role_id, { runner, unscoped: true })
            .then(ctx.assertFound.bind(ctx)),
          ctx
            .services
            .permissionRepository
            .findByPkOrfail(dto.permission_id, { runner, unscoped: true })
            .then(ctx.assertFound.bind(ctx)),
        ]);
        // authorise create
        ctx.authorize(
          ctx.services.rolePermissionPolicy.canCreate({ role, permission }),
          RolePermissionLang.CannotCreate,
        );
        // do create
        const result = await ctx.services.rolePermissionService.create({ runner, permission, role });
        return result;
      });
      return final;
    },
  },

  /**
   * HardDelete RolePermission
   */
  hardDeleteRolePermission: {
    type: GraphQLNonNull(GraphQLBoolean),
    args: { dto: { type: GraphQLNonNull(DeleteRolePermissionGqlInput) } },
    resolve: async (parent, args, ctx): Promise<boolean> => {
      // authorise access
      ctx.authorize( ctx.services.rolePermissionPolicy.canAccess(), RolePermissionLang.CannotCreate,);
      // validate
      const dto = ctx.validate(DeleteRolePermissionValidator, args.dto);
      await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const model: RolePermissionModel = await ctx.services.rolePermissionRepository.findByPkOrfail(dto.role_permission_id, {
          runner,
          unscoped: true,
          options: {
            include: [
              { association: RolePermissionAssociation.permission, },
              { association: RolePermissionAssociation.role, },
            ],
          },
        });
        const role = assertDefined(model.role);
        const permission = assertDefined(model.permission);
        // authorise view
        ctx.services.rolePermissionRepository._404Unless(ctx.services.rolePermissionPolicy.canFindOne({
          model,
          role,
          permission,
        }));
        // authorise hard-delete
        ctx.authorize(
          ctx.services.rolePermissionPolicy.canHardDelete({ model, role, permission, }),
          RolePermissionLang.CannotHardDelete,
        );
        // do hard-delete
        await ctx.services.rolePermissionService.hardDelete({ runner, model });
        return model;
      });
      return true;
    },
  },
});