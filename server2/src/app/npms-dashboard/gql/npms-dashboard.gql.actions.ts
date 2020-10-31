import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { NpmsDashboardModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";


export type INpmsDashboardGqlActionsSource = NpmsDashboardModel;
export const NpmsDashboardGqlActions = new GraphQLObjectType<INpmsDashboardGqlActionsSource, GqlContext>({
  name: 'NpmsDashboardActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.npmsDashboardPolicy.canFindOne({ model: parent });
      },
    },
    update: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.npmsDashboardPolicy.canUpdate({ model: parent });
      },
    },
    delete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.npmsDashboardPolicy.canDelete({ model: parent });
      },
    },
  },
});
