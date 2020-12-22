import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { NpmsDashboardStatusModel } from "../npms-dashboard-status.model";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { Op } from "sequelize";
import { INpmsDashboardCollectionGqlNodeSource, NpmsDashboardCollectionGqlNode } from "../../npms-dashboard/gql/npms-dashboard.collection.gql.node";
import { NpmsDashboardCollectionOptionsGqlInput } from "../../npms-dashboard/gql/npms-dashboard.collection.gql.options";
import { NpmsDashboardField } from "../../npms-dashboard/npms-dashboard.attributes";


export type INpmsDashboardStatusGqlRelationsSource = NpmsDashboardStatusModel;
export const NpmsDashboardStatusGqlRelations: GraphQLObjectType<INpmsDashboardStatusGqlRelationsSource, GqlContext> = new GraphQLObjectType({
  name: 'NpmsDashboardStatusRelations',
  fields: () => ({
    npmsDashboards: {
      type: GraphQLNonNull(NpmsDashboardCollectionGqlNode),
      args: gqlQueryArg(NpmsDashboardCollectionOptionsGqlInput),
      resolve: async (parent, args, ctx): Promise<INpmsDashboardCollectionGqlNodeSource> => {
        const collection = await ctx.services.npmsDashboardRepository.gqlCollection({
          runner: null,
          args,
          where: { [NpmsDashboardField.status_id]: { [Op.eq]: parent.id }, },
        });
        return collection;
      },
    },
  }),
});
