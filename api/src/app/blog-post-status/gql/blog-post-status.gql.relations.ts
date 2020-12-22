import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { BlogPostStatusModel } from "../blog-post-status.model";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { Op } from "sequelize";
import { BlogPostCommentLang } from "../../blog-post-comment/blog-post-comment.lang";
import { BlogPostField } from "../../blog-post/blog-post.attributes";
import { BlogPostCollectionGqlNode, IBlogPostCollectionGqlNodeSource } from "../../blog-post/gql/blog-post.collection.gql.node";
import { BlogPostCollectionOptionsGqlInput } from "../../blog-post/gql/blog-post.collection.gql.options";


export type IBlogPostStatusGqlRelationsSource = BlogPostStatusModel;
export const BlogPostStatusGqlRelations: GraphQLObjectType<IBlogPostStatusGqlRelationsSource, GqlContext> = new GraphQLObjectType({
  name: 'BlogPostStatusRelations',
  fields: () => ({
    posts: {
      type: GraphQLNonNull(BlogPostCollectionGqlNode),
      args: gqlQueryArg(BlogPostCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<IBlogPostCollectionGqlNodeSource> => {
        ctx.authorize(ctx.services.userPolicy.canFindMany(), BlogPostCommentLang.CannotFindMany);
        const collection = ctx.services.blogPostRepository.gqlCollection({
          runner: null,
          args,
          where: { [BlogPostField.status_id]: { [Op.eq]: parent.id, }, },
        });
        return collection;
      },
    },
  }),
});
