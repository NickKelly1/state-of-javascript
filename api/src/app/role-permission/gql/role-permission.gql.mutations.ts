import { GraphQLBoolean, GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { RolePermissionModel, UserModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { CreateRolePermissionGqlInput, CreateRolePermissionValidator } from "../dtos/create-role-permission.gql";
import { DeleteRolePermissionGqlInput, DeleteRolePermissionValidator } from "../dtos/delete-role-permission.gql";
import { RolePermissionAssociation } from "../role-permission.associations";
import { IRolePermissionGqlNodeSource, RolePermissionGqlNode } from "./role-permission.gql.node";

export const RolePermissionGqlMutations: Thunk<GraphQLFieldConfigMap<undefined, GqlContext>> = () => ({
  createRolePermission: {
    type: GraphQLNonNull(RolePermissionGqlNode),
    args: { dto: { type: GraphQLNonNull(CreateRolePermissionGqlInput) } },
    resolve: async (parent, args, ctx): Promise<IRolePermissionGqlNodeSource> => {
      const dto = ctx.validate(CreateRolePermissionValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
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
        ctx.authorize(ctx.services.rolePermissionPolicy.canCreate({ role, permission }));
        const result = await ctx.services.rolePermissionService.create({ runner, permission, role });
        return result;
      });
      return model;
    },
  },

  deleteRolePermission: {
    type: GraphQLNonNull(GraphQLBoolean),
    args: { dto: { type: GraphQLNonNull(DeleteRolePermissionGqlInput) } },
    resolve: async (parent, args, ctx): Promise<boolean> => {
      const dto = ctx.validate(DeleteRolePermissionValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
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
        ctx.authorize(ctx.services.rolePermissionPolicy.canHardDelete({ model, role, permission, }));
        await ctx.services.rolePermissionService.delete({ runner, model });
        return model;
      });
      return true;
    },
  },
});