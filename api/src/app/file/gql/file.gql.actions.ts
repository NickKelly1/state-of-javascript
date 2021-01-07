import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { FileModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";


/**
 * FileActions
 * 
 * Note: these need to be modifiable via owner entities
 * 
 * For example, if a BlogPost owns a File, a BlogPost editor should be able to update the file...
 */
export type IFileGqlActionsSource = FileModel;
export const FileGqlActions = new GraphQLObjectType<IFileGqlActionsSource, GqlContext>({
  name: 'FileActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.filePolicy.canFindOne({ model: parent });
      },
    },
    update: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.filePolicy.canUpdate({ model: parent });
      },
    },
    softDelete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.filePolicy.canSoftDelete({ model: parent });
      },
    },
    hardDelete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.filePolicy.canHardDelete({ model: parent });
      },
    },
    restore: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.filePolicy.canRestore({ model: parent });
      },
    },
  },
});
