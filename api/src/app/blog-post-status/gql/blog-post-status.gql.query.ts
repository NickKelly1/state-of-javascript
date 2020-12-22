import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { BlogPostStatusLang } from "../blog-post-status.lang";
import { BlogPostStatusCollectionGqlNode, IBlogPostStatusCollectionGqlNodeSource } from "./blog-post-status.collection.gql.node";
import { BlogPostStatusCollectionOptionsGqlInput } from "./blog-post-status.collection.gql.options";


export const BlogPostStatusGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  blogPostStatuses: {
    type: GraphQLNonNull(BlogPostStatusCollectionGqlNode),
    args: gqlQueryArg(BlogPostStatusCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<IBlogPostStatusCollectionGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.blogPostStatusPolicy.canAccess(), BlogPostStatusLang.CannotAccess);
      // authorise find-many
      ctx.authorize(ctx.services.blogPostStatusPolicy.canFindMany(), BlogPostStatusLang.CannotFindMany);
      // find
      const collection = await ctx.services.blogPostStatusRepository.gqlCollection({
        args,
        runner: null,
      });
      return collection;
    },
  },
});