import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { ImageModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";


/**
 * ImageActions
 * 
 * Note: these need to be modifiable via owner entities
 * 
 * For example, if a BlogPost owns an image, a BlogPost editor should be able to update the image...
 */
export type IImageGqlActionsSource = ImageModel;
export const ImageGqlActions = new GraphQLObjectType<IImageGqlActionsSource, GqlContext>({
  name: 'ImageActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.imagePolicy.canFindOne({ model: parent });
      },
    },
    update: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.imagePolicy.canUpdate({ model: parent });
      },
    },
    softDelete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.imagePolicy.canSoftDelete({ model: parent });
      },
    },
    hardDelete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.imagePolicy.canHardDelete({ model: parent });
      },
    },
    restore: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.imagePolicy.canRestore({ model: parent });
      },
    },
  },
});
