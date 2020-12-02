import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean } from "graphql";
import { GqlContext } from "../../common/context/gql.context";
import { IGqlNever } from "../../common/gql/gql.ever";

export type IJobCollectionGqlActionSource = IGqlNever;
export const JobCollectionGqlActions = new GraphQLObjectType<IJobCollectionGqlActionSource, GqlContext>({
  name: 'JobCollectionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.jobPolicy.canFindMany();
      },
    },
  },
});