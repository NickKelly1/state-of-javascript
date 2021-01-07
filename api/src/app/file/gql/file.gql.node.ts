import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { FileModel } from "../../../circle";
import { IFileGqlActionsSource, FileGqlActions } from "./file.gql.actions";
import { IFileGqlDataSource, FileGqlData } from "./file.gql.data";
import { GqlContext } from "../../../common/context/gql.context";
import { FileGqlRelations, IFileGqlRelationsSource } from "./file.gql.relations";

export type IFileGqlNodeSource = FileModel;
export const FileGqlNode: GraphQLObjectType<IFileGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'FileNode',
  fields: () => ({
    cursor: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (parent): string => `file_${parent.id.toString()}`,
    },
    data: {
      type: GraphQLNonNull(FileGqlData),
      resolve: (parent): IFileGqlDataSource => parent,
    },
    can: {
      type: GraphQLNonNull(FileGqlActions),
      resolve: (parent): IFileGqlActionsSource => parent,
    },
    relations: {
      type: GraphQLNonNull(FileGqlRelations),
      resolve: function (parent): IFileGqlRelationsSource {
        return parent;
      },
    },
  }),
});
