import { GraphQLBoolean, GraphQLFloat, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { FileModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { SoftDeleteableGql } from "../../../common/gql/gql.soft-deleteable";
import { FileField } from "../file.attributes";


export type IFileGqlDataSource = FileModel;
export const FileGqlData: GraphQLObjectType<FileModel, GqlContext> = new GraphQLObjectType({
  name: 'FileData',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLFloat), resolve: (parent): number => parent[FileField.id] },
    uploader_aid: { type: GraphQLNonNull(GraphQLString), resolve: (parent): string => parent[FileField.uploader_aid] },
    uploader_id: { type: GraphQLNonNull(GraphQLFloat), resolve: (parent): number => parent[FileField.uploader_id] },
    title: { type: GraphQLNonNull(GraphQLString), resolve: (parent): string => parent[FileField.title] },
    encoding: { type: GraphQLNonNull(GraphQLString), resolve: (parent): string => parent[FileField.encoding] },
    mimetype: { type: GraphQLNonNull(GraphQLString), resolve: (parent): string => parent[FileField.mimetype] },
    filename: { type: GraphQLNonNull(GraphQLString), resolve: (parent): string => parent[FileField.filename] },
    is_public: { type: GraphQLNonNull(GraphQLBoolean), resolve: (parent): boolean => parent[FileField.is_public] },
    ...AuditableGql,
    ...SoftDeleteableGql,
  }),
});
