import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/classes/gql.context";
import { RolePermissionModel } from "../role-permission.model";
import { IRoleGqlEdge, RoleGqlEdge } from "../../role/gql/role.gql.edge";
import { IPermissionGqlEdge, PermissionGqlEdge } from "../../permission/gql/permission.gql.edge";


export type IRolePermissionGqlNode = RolePermissionModel;
export const RolePermissionGqlNode: GraphQLObjectType<RolePermissionModel, GqlContext> = new GraphQLObjectType<RolePermissionModel, GqlContext>({
  name: 'RolePermission',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    role_id: { type: GraphQLNonNull(GraphQLInt), },
    permission_id: { type: GraphQLNonNull(GraphQLInt), },

    role: {
      type: GraphQLNonNull(RoleGqlEdge),
      resolve: async (parent, args, ctx): Promise<IRoleGqlEdge> => {
        const model = await ctx.loader.roles.load(parent.role_id);
        const edge: IRoleGqlEdge = { node: model, cursor: model.id.toString(), };
        return edge;
      },
    },

    permission: {
      type: GraphQLNonNull(PermissionGqlEdge),
      resolve: async (parent, args, ctx): Promise<IPermissionGqlEdge> => {
        const model = await ctx.loader.permissions.load(parent.permission_id);
        const edge: IPermissionGqlEdge = { node: model, cursor: model.id.toString(), };
        return edge;
      },
    },
  }),
});
