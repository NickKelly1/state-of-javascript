import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { NpmsDashboardItemModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";


export type INpmsDashboardItemGqlActionsSource = NpmsDashboardItemModel;
export const NpmsDashboardItemGqlActions = new GraphQLObjectType<INpmsDashboardItemGqlActionsSource, GqlContext>({
  name: 'NpmsDashboardItemActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        const [dashboard, npmsPackage] = await Promise.all([
          ctx.loader.npmsDashboard.load(parent.dashboard_id).then(assertDefined),
          ctx.loader.npmsPackage.load(parent.npms_package_id).then(assertDefined),
        ]);
        return ctx.services.npmsDashboardItemPolicy.canFindOne({ model: parent, dashboard, npmsPackage });
      },
    },
    hardDelete: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        const [dashboard, npmsPackage] = await Promise.all([
          ctx.loader.npmsDashboard.load(parent.dashboard_id).then(assertDefined),
          ctx.loader.npmsPackage.load(parent.npms_package_id).then(assertDefined),
        ]);
        return ctx.services.npmsDashboardItemPolicy.canHardDelete({ model: parent, dashboard, npmsPackage });
      },
    },
  },
});
