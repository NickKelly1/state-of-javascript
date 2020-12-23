import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { BlogPostLang } from "../blog-post.lang";
import { BlogPostCollectionGqlNode, IBlogPostCollectionGqlNodeSource } from "./blog-post.collection.gql.node";
import { BlogPostCollectionOptionsGqlInput } from "./blog-post.collection.gql.options";


export const BlogPostsGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  blogPosts: {
    type: GraphQLNonNull(BlogPostCollectionGqlNode),
    args: gqlQueryArg(BlogPostCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<IBlogPostCollectionGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.blogPostPolicy.canAccess(), BlogPostLang.CannotAccess);
      // authorise find-many
      ctx.authorize(ctx.services.blogPostPolicy.canFindMany(), BlogPostLang.CannotFindMany);
      // find
      const collection = await ctx.services.blogPostRepository.gqlCollection({
        args,
        runner: null,
        where: null,
      });
      return collection;
    },
  },
});