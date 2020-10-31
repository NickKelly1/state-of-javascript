import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { NpmsDashboardItemModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";


export type INpmsDashboardItemGqlActionsSource = NpmsDashboardItemModel;
export const NpmsDashboardItemGqlActions = new GraphQLObjectType<INpmsDashboardItemGqlActionsSource, GqlContext>({
  name: 'NpmsDashboardItemActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.npmsDashboardItemPolicy.canFindOne({ model: parent });
      },
    },
    delete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.npmsDashboardItemPolicy.canDelete({ model: parent });
      },
    },
  },
});
