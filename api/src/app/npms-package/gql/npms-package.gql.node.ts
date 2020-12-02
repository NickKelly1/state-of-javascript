import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { INpmsPackageGqlActionsSource, NpmsPackageGqlActions } from "./npms-package.gql.actions";
import { INpmsPackageGqlRelationsSource, NpmsPackageGqlRelations } from "./npms-package.gql.relations";
import { INpmsPackageGqlDataSource, NpmsPackageGqlData } from "./npms-package.gql.data";
import { GqlContext } from "../../../common/context/gql.context";
import { NpmsPackageModel } from "../npms-package.model";

export type INpmsPackageGqlNodeSource = NpmsPackageModel;
export const NpmsPackageGqlNode: GraphQLObjectType<INpmsPackageGqlNodeSource, GqlContext> = new GraphQLObjectType({
  name: 'NpmsPackageNode',
  fields: () => ({
    cursor: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (parent): string => `npms_${parent.id.toString()}`,
    },
    data: {
      type: GraphQLNonNull(NpmsPackageGqlData),
      resolve: (parent): INpmsPackageGqlDataSource => parent,
    },
    can: {
      type: GraphQLNonNull(NpmsPackageGqlActions),
      resolve: (parent): INpmsPackageGqlActionsSource => parent,
    },
    relations: {
      type: GraphQLNonNull(NpmsPackageGqlRelations),
      resolve: function (parent): INpmsPackageGqlRelationsSource {
        return parent;
      },
    },
  }),
});
