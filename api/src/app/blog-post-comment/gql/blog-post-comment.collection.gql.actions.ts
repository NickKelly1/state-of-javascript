import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { IGqlNever } from "../../../common/gql/gql.ever";

export type IBlogPostCommentCollectionGqlActionSource = IGqlNever;
export const BlogPostCommentCollectionGqlActions = new GraphQLObjectType<IBlogPostCommentCollectionGqlActionSource, GqlContext>({
  name: 'BlogPostCommentCollectionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        // @note: doesn't take BlogPost into account...
        return ctx.services.blogPostCommentPolicy.canFindMany();
      },
    },
    create: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        // @note: doesn't take BlogPost into account...
        return ctx.services.blogPostCommentPolicy.canCreate();
      },
    },
  },
});
