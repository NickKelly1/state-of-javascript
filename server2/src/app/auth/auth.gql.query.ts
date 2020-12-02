import { Thunk, GraphQLFieldConfigMap, GraphQLNonNull, GraphQLBoolean } from "graphql";
import { GqlContext } from "../../common/context/gql.context";

export const AuthGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = {
  // not required...
  // /**
  //  * Me?
  //  */
  // me: {
  //   type: GraphQLNonNull(MeGqlNode),
  //   resolve: async (parent, args, ctx): Promise<IMeGqlNodeSource> => {
  //     //
  //   },
  // },
};
