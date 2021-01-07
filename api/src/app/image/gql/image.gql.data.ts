import {
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { ImageModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { SoftDeleteableGql } from "../../../common/gql/gql.soft-deleteable";
import { OrNull } from "../../../common/types/or-null.type";
import { ImageField } from "../image.attributes";


export type IImageGqlDataSource = ImageModel;
export const ImageGqlData: GraphQLObjectType<ImageModel, GqlContext> = new GraphQLObjectType({
  name: 'ImageData',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLFloat), resolve: (parent): number => parent[ImageField.id] },
    fsid: { type: GraphQLNonNull(GraphQLString), resolve: (parent): string => parent[ImageField.fsid], },
    title: { type: GraphQLNonNull(GraphQLString), resolve: (parent): string => parent[ImageField.title], },
    thumbnail_id: { type: GraphQLFloat, resolve: (parent): OrNull<number> => parent[ImageField.thumbnail_id], },
    original_id: { type: GraphQLFloat, resolve: (parent): OrNull<number> => parent[ImageField.original_id], },
    display_id: { type: GraphQLFloat, resolve: (parent): OrNull<number> => parent[ImageField.display_id], },
    ...AuditableGql,
    ...SoftDeleteableGql,
  }),
});

