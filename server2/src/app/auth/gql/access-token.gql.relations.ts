import { GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { OrNull } from "../../../common/types/or-null.type";
import { UserGqlNode, IUserGqlNodeSource } from "../../user/gql/user.gql.node";
import { IAccessToken } from "../token/access.token.gql";

export type IAccessTokenGqlRelationsSource = IAccessToken;
export const AccessTokenGqlRelations = new GraphQLObjectType<IAccessTokenGqlRelationsSource, GqlContext>({
  name: 'AccessTokenRelations',
  fields: () => ({
    user: {
      type: UserGqlNode,
      resolve: async (parent, args, ctx): Promise<OrNull<IUserGqlNodeSource>> => {
        const user = await ctx.services.userRepository.findByPk(parent.user_id, { runner: null });
        ctx.loader.users.prime(parent.user_id, user);
        if (!user) return null;
        if (!ctx.services.userPolicy.canFindOne({ model: user })) return null;
        return user;
      },
    },
  }),
});