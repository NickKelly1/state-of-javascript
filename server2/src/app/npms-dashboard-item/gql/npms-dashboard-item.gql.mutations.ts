import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { NpmsDashboardItemModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { CreateNpmsDashboardItemGqlInput, CreateNpmsDashboardItemValidator } from "../dtos/create-npms-dashboard-item.gql";
import { DeleteNpmsDashboardItemGqlInput, DeleteNpmsDashboardItemValidator } from "../dtos/delete-npms-dashboard-item.gql";
import { NpmsDashboardItemAssociation } from "../npms-dashboard-item.associations";
import { INpmsDashboardItemGqlNodeSource, NpmsDashboardItemGqlNode } from "./npms-dashboard-item.gql.node";

export const NpmsDashboardItemGqlMutations: Thunk<GraphQLFieldConfigMap<undefined, GqlContext>> = () => ({
  createNpmsDashboardItem: {
    type: GraphQLNonNull(NpmsDashboardItemGqlNode),
    args: { dto: { type: GraphQLNonNull(CreateNpmsDashboardItemGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INpmsDashboardItemGqlNodeSource> => {
      ctx.authorize(ctx.services.npmsDashboardItemPolicy.canCreate());
      const dto = ctx.validate(CreateNpmsDashboardItemValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
        const [dashboard, npmsPackage] = await Promise.all([
          // cannot edit if cannot see the dashboard and npms...
          ctx.services.npmsDashboardRepository.findByPkOrfail(dto.dashboard_id, { runner }),
          ctx.services.npmsPackageRepository.findByPkOrfail(dto.npms_id, { runner }),
        ]);
        const NpmsDashboardItem = await ctx.services.npmsDashboardItemService.create({ runner, dashboard, npmsPackage, dto });
        return NpmsDashboardItem;
      });
      return model;
    },
  },

  deleteNpmsDashboardItem: {
    type: GraphQLNonNull(NpmsDashboardItemGqlNode),
    args: { dto: { type: GraphQLNonNull(DeleteNpmsDashboardItemGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INpmsDashboardItemGqlNodeSource> => {
      const dto = ctx.validate(DeleteNpmsDashboardItemValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
        const NpmsDashboardItem: NpmsDashboardItemModel = await ctx.services.npmsDashboardItemRepository.findByPkOrfail(dto.id, {
          runner,
          options: {
            include: [
              { association: NpmsDashboardItemAssociation.dashboard, },
              { association: NpmsDashboardItemAssociation.npmsPackage, },
            ],
          }
        });
        const dashboard = assertDefined(NpmsDashboardItem.dashboard);
        const npmsPackage = assertDefined(NpmsDashboardItem.npmsPackage);
        ctx.authorize(ctx.services.npmsDashboardItemPolicy.canDelete({ model: NpmsDashboardItem }));
        await ctx.services.npmsDashboardItemService.delete({ runner, dashboard, npmsPackage, model: NpmsDashboardItem });
        return NpmsDashboardItem;
      });
      return model;
    },
  },
});