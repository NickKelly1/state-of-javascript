import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ImageModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { IImageGqlActionsSource, ImageGqlActions } from "./image.gql.actions";
import { IImageGqlDataSource, ImageGqlData } from "./image.gql.data";
import { IImageGqlRelationsSource, ImageGqlRelations } from "./image.gql.relations";

export type IImageGqlNodeSource = ImageModel;
export const ImageGqlNode: GraphQLObjectType<IImageGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'ImageNode',
  fields: () => ({
    cursor: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (parent): string => `image_${parent.id.toString()}`,
    },
    data: {
      type: GraphQLNonNull(ImageGqlData),
      resolve: (parent): IImageGqlDataSource => parent,
    },
    can: {
      type: GraphQLNonNull(ImageGqlActions),
      resolve: (parent): IImageGqlActionsSource => parent,
    },
    relations: {
      type: GraphQLNonNull(ImageGqlRelations),
      resolve: function (parent): IImageGqlRelationsSource {
        return parent;
      },
    },
  }),
});
