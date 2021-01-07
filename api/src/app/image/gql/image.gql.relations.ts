import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { OrNull } from "../../../common/types/or-null.type";
import { GqlContext } from "../../../common/context/gql.context";
import { ImageModel } from "../../../circle";
import { FileModel } from "../../file/file.model";
import { Op } from "sequelize";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { BlogPostField } from "../../blog-post/blog-post.attributes";
import { BlogPostCollectionGqlNode, IBlogPostCollectionGqlNodeSource } from "../../blog-post/gql/blog-post.collection.gql.node";
import { BlogPostCollectionOptionsGqlInput } from "../../blog-post/gql/blog-post.collection.gql.options";
import { BlogPostLang } from "../../blog-post/blog-post.lang";
import { FileGqlNode, IFileGqlNodeSource } from "../../file/gql/file.gql.node";


export type IImageGqlRelationsSource = ImageModel;
export const ImageGqlRelations: GraphQLObjectType<IImageGqlRelationsSource, GqlContext> = new GraphQLObjectType({
  name: 'ImageRelations',
  fields: () => ({
    original: {
      type: FileGqlNode,
      resolve: async (parent, args, ctx): Promise<OrNull<IFileGqlNodeSource>> => {
        if (!parent.original_id) return null;
        const model: OrNull<FileModel> = await ctx.loader.files.load(parent.original_id);
        if (!model) return null;
        if (!ctx.services.filePolicy.canFindOne({ model: model })) return null;
        return model;
      },
    },

    display: {
      type: FileGqlNode,
      resolve: async (parent, args, ctx): Promise<OrNull<IFileGqlNodeSource>> => {
        if (!parent.display_id) return null;
        const model: OrNull<FileModel> = await ctx.loader.files.load(parent.display_id);
        if (!model) return null;
        if (!ctx.services.filePolicy.canFindOne({ model: model })) return null;
        return model;
      },
    },

    thumbnail: {
      type: FileGqlNode,
      resolve: async (parent, args, ctx): Promise<OrNull<IFileGqlNodeSource>> => {
        if (!parent.thumbnail_id) return null;
        const model: OrNull<FileModel> = await ctx.loader.files.load(parent.thumbnail_id);
        if (!model) return null;
        if (!ctx.services.filePolicy.canFindOne({ model: model })) return null;
        return model;
      },
    },

    blogPosts: {
      type: GraphQLNonNull(BlogPostCollectionGqlNode),
      args: gqlQueryArg(BlogPostCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<IBlogPostCollectionGqlNodeSource> => {
        ctx.authorize(ctx.services.blogPostPolicy.canFindMany(), BlogPostLang.CannotFindMany);
        const collection = ctx.services.blogPostRepository.gqlCollection({
          runner: null,
          args,
          where: { [BlogPostField.image_id]: { [Op.eq]: parent.id, }, },
        });
        return collection;
      },
    },
  }),
});


export {};