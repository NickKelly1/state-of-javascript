import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { NewsArticleStatusModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";


export type INpmsDashboardStatusGqlActionsSource = NewsArticleStatusModel;
export const NpmsDashboardStatusGqlActions = new GraphQLObjectType<INpmsDashboardStatusGqlActionsSource, GqlContext>({
  name: 'NpmsDashboardStatusActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.npmsDashboardStatusPolicy.canFindOne({ model: parent });
      },
    },
  },
});
