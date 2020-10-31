import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { NpmsPackageModel } from "../npms-package.model";


export type INpmsPackageGqlActionsSource = NpmsPackageModel;
export const NpmsPackageGqlActions = new GraphQLObjectType<INpmsPackageGqlActionsSource, GqlContext>({
  name: 'NpmsPackageActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.npmsPackagePolicy.canFindOne({ model: parent });
      },
    },
    delete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.npmsPackagePolicy.canDelete({ model: parent });
      },
    },
  },
});
