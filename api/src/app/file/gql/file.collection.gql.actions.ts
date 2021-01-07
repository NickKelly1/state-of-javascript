import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { IGqlNever } from "../../../common/gql/gql.ever";

/**
 * FileCollectionActions
 *
 * Note that users may still be able to show or create files through blog posts / news articles / etc
 *
 * These actions advise whether the Requester can action ALL files
 */
export type IFileCollectionGqlActionSource = IGqlNever;
export const FileCollectionGqlActions = new GraphQLObjectType<IFileCollectionGqlActionSource, GqlContext>({
  name: 'FileCollectionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.filePolicy.canFindMany();
      },
    },
    create: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.filePolicy.canCreate();
      },
    },
  },
});
