import { GraphQLObjectType } from "graphql";
import { UserRoleModel } from "../user-role.model";
import { IUserGqlNodeSource, UserGqlNode } from "../../user/gql/user.gql.node";
import { OrNull } from "../../../common/types/or-null.type";
import { IRoleGqlNodeSource, RoleGqlNode } from "../../role/gql/role.gql.node";
import { GqlContext } from "../../../common/context/gql.context";

export type IUserRoleGqlRelationsSource = UserRoleModel;
export const UserRoleGqlRelations: GraphQLObjectType<IUserRoleGqlRelationsSource, GqlContext> = new GraphQLObjectType({
  name: 'UserRoleRelations',
  fields: () => ({
    user: {
      type: UserGqlNode,
      resolve: async (parent, args, ctx): Promise<OrNull<IUserGqlNodeSource>> => {
        const model: OrNull<IUserGqlNodeSource> = await ctx.loader.users.load(parent.user_id);
        if (!model) return null;
        if (!ctx.services.userPolicy.canFindOne({ model })) return null;
        return model;
      },
    },

    role: {
      type: RoleGqlNode,
      resolve: async (parent, args, ctx): Promise<OrNull<IRoleGqlNodeSource>> => {
        const model: OrNull<IRoleGqlNodeSource> = await ctx.loader.roles.load(parent.role_id);
        if (!model) return null;
        if (!ctx.services.rolePolicy.canFindOne({ model })) return null;
        return model;
      },
    },
  }),
});
