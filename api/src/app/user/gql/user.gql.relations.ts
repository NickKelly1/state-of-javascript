import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { UserRoleCollectionOptionsGqlInput } from "../../user-role/gql/user-role.collection.gql.options";
import { UserRoleField } from "../../user-role/user-role.attributes";
import { Op } from "sequelize";
import { NewsArticleCollectionOptionsGqlInput } from "../../news-article/gql/news-article.collection.gql.options";
import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { UserModel } from "../user.model";
import { IUserRoleCollectionGqlNodeSource, UserRoleCollectionGqlNode } from "../../user-role/gql/user-role.collection.gql.node";
import { INewsArticleCollectionGqlNodeSource, NewsArticleCollectionGqlNode } from "../../news-article/gql/news-article.collection.gql.node";
import { NewsArticleField } from "../../news-article/news-article.attributes";
import { GqlContext } from "../../../common/context/gql.context";
import { IRoleCollectionGqlNodeSource, RoleCollectionGqlNode } from "../../role/gql/role.collection.gql.node";
import { RoleCollectionOptionsGqlInput } from "../../role/gql/role.collection.gql.options";
import { RoleAssociation } from "../../role/role.associations";
import { UserField } from "../user.attributes";
import { PermissionCollectionGqlNode, IPermissionCollectionGqlNodeSource } from "../../permission/gql/permission.collection.gql.node";
import { PermissionCollectionOptionsGqlInput } from "../../permission/gql/permission.collection.gql.options";
import { PermissionAssociation } from "../../permission/permission.associations";
import { BlogPostCommentField } from "../../blog-post-comment/blog-post-comment.attributes";
import { BlogPostCommentLang } from "../../blog-post-comment/blog-post-comment.lang";
import { BlogPostCommentCollectionGqlNode, IBlogPostCommentCollectionGqlNodeSource } from "../../blog-post-comment/gql/blog-post-comment.collection.gql.node";
import { BlogPostCommentCollectionOptionsGqlInput } from "../../blog-post-comment/gql/blog-post-comment.collection.gql.options";
import { BlogPostField } from "../../blog-post/blog-post.attributes";
import { BlogPostCollectionGqlNode, IBlogPostCollectionGqlNodeSource } from "../../blog-post/gql/blog-post.collection.gql.node";
import { BlogPostCollectionOptionsGqlInput } from "../../blog-post/gql/blog-post.collection.gql.options";

export type IUserGqlRelationsSource = UserModel;
export const UserGqlRelations = new GraphQLObjectType<IUserGqlRelationsSource, GqlContext>({
  name: 'UserRelations',
  fields: () => ({
    userRoles: {
      type: GraphQLNonNull(UserRoleCollectionGqlNode),
      args: gqlQueryArg(UserRoleCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<IUserRoleCollectionGqlNodeSource> => {
        const collection = await ctx.services.userRoleRepository.gqlCollection({
          runner: null,
          args,
          where: { [UserRoleField.user_id]: { [Op.eq]: parent.id } },
        });
        return collection;
      },
    },

    roles: {
      type: GraphQLNonNull(RoleCollectionGqlNode),
      args: gqlQueryArg(RoleCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<IRoleCollectionGqlNodeSource> => {
        const collection = await ctx.services.roleRepository.gqlCollection({
          runner: null,
          args,
          include: [{
            association: RoleAssociation.users,
            where: { [UserField.id]: { [Op.eq]: parent.id } },
          }]
        });
        return collection;
      },
    },

    permissions: {
      type: GraphQLNonNull(PermissionCollectionGqlNode),
      args: gqlQueryArg(PermissionCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<IPermissionCollectionGqlNodeSource> => {
        const collection = await ctx.services.permissionRepository.gqlCollection({
          runner: null,
          args,
          include: [
            { association: PermissionAssociation.category, },
            {
              association: PermissionAssociation.roles,
              include: [{
                association: RoleAssociation.users,
                where: { [UserField.id]: { [Op.eq]: parent.id } },
              }],
            }
          ],
        });
        return collection;
      },
    },

    newsArticles: {
      type: GraphQLNonNull(NewsArticleCollectionGqlNode),
      args: gqlQueryArg(NewsArticleCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<INewsArticleCollectionGqlNodeSource> => {
        const collection = await ctx.services.newsArticleRepository.gqlCollection({
          runner: null,
          args,
          where: { [NewsArticleField.author_id]: { [Op.eq]: parent.id } },
        });
        return collection;
      },
    },

    blogPosts: {
      type: GraphQLNonNull(BlogPostCollectionGqlNode),
      args: gqlQueryArg(BlogPostCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<IBlogPostCollectionGqlNodeSource> => {
        ctx.authorize(ctx.services.userPolicy.canFindMany(), BlogPostCommentLang.CannotFindMany);
        const collection = ctx.services.blogPostRepository.gqlCollection({
          runner: null,
          args,
          where: { [BlogPostField.author_id]: { [Op.eq]: parent.id, }, },
        });
        return collection;
      },
    },

    blogPostComments: {
      type: GraphQLNonNull(BlogPostCommentCollectionGqlNode),
      args: gqlQueryArg(BlogPostCommentCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<IBlogPostCommentCollectionGqlNodeSource> => {
        ctx.authorize(ctx.services.userPolicy.canFindMany(), BlogPostCommentLang.CannotFindMany);
        const collection = ctx.services.blogPostCommentRepository.gqlCollection({
          runner: null,
          args,
          where: { [BlogPostCommentField.author_id]: { [Op.eq]: parent.id, }, },
        });
        return collection;
      },
    },

  }),
});