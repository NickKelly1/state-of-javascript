import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { IGqlNever } from "../../../common/gql/gql.ever";

/**
 * ImageCollectionActions
 *
 * Note that users may still be able to show or create images through blog posts / news articles / etc
 *
 * These actions advise whether the Requester can action ALL images
 */
export type IImageCollectionGqlActionSource = IGqlNever;
export const ImageCollectionGqlActions = new GraphQLObjectType<IImageCollectionGqlActionSource, GqlContext>({
  name: 'ImageCollectionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.imagePolicy.canFindMany();
      },
    },

    create: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.imagePolicy.canCreate();
      },
    },
  },
});
