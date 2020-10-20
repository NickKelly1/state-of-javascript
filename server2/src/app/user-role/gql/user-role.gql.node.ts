import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { UserRoleModel } from "../user-role.model";
import { IUserGqlEdge, UserGqlEdge } from "../../user/gql/user.gql.edge";
import { GqlContext } from "../../../common/classes/gql.context";
import { IRoleGqlEdge, RoleGqlEdge } from "../../role/gql/role.gql.edge";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { OrNull } from "../../../common/types/or-null.type";


export type IUserRoleGqlNode = UserRoleModel;
export const UserRoleGqlNode: GraphQLObjectType<IUserRoleGqlNode, GqlContext> = new GraphQLObjectType<IUserRoleGqlNode, GqlContext>({
  name: 'UserRole',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    user_id: { type: GraphQLNonNull(GraphQLInt), },
    role_id: { type: GraphQLNonNull(GraphQLInt), },
    ...AuditableGql,

    user: {
      type: UserGqlEdge,
      resolve: async (parent, args, ctx): Promise<OrNull<IUserGqlEdge>> => {
        const model = await ctx.loader.users.load(parent.user_id);
        const edge: IUserGqlEdge = { node: model, cursor: model.id.toString(), };
        if (!ctx.services.userPolicy().canFindOne({ model })) return null;
        return edge;
      },
    },

    role: {
      type: RoleGqlEdge,
      resolve: async (parent, args, ctx): Promise<OrNull<IRoleGqlEdge>> => {
        const model = await ctx.loader.roles.load(parent.role_id);
        const edge: IRoleGqlEdge = { node: model, cursor: model.id.toString(), };
        if (!ctx.services.rolePolicy().canFindOne({ model })) return null;
        return edge;
      },
    },
  }),
});
