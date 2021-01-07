import { GraphQLObjectType } from "graphql";
import { OrNull } from "../../../common/types/or-null.type";
import { IUserGqlNodeSource, UserGqlNode } from "../../user/gql/user.gql.node";
import { GqlContext } from "../../../common/context/gql.context";
import { FileModel } from "../../../circle";


export type IFileGqlRelationsSource = FileModel;
export const FileGqlRelations: GraphQLObjectType<IFileGqlRelationsSource, GqlContext> = new GraphQLObjectType({
  name: 'FileRelations',
  fields: () => ({
    uploader: {
      type: UserGqlNode,
      resolve: async (parent, args, ctx): Promise<OrNull<IUserGqlNodeSource>> => {
        const model: OrNull<IUserGqlNodeSource> = await ctx.loader.users.load(parent.uploader_id);
        if (!model) return null;
        if (!ctx.services.userPolicy.canFindOne({ model })) return null;
        return model;
      },
    },

    // TODO: add two-way data-loader for one-to-one relations & prime properly...
    // otherwise don't expose the reverse relation since it has n+1 problem
    // thumbnailImage: {
    //   type: ImageGqlNode,
    //   resolve: async (parent, args, ctx): Promise<OrNull<IImageGqlNodeSource>> => {
    //     const model: OrNull<IImageGqlNodeSource> = await ctx.loader.images.load(parent.id);
    //     if (!model) return null;
    //     if (!ctx.services.userPolicy.canFindOne({ model })) return null;
    //     return model;
    //   },
    // },
  }),
});


export {};