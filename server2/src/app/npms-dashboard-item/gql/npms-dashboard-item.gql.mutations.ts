import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { NpmsDashboardItemModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { NpmsDashboardAssociation } from "../../npms-dashboard/npms-dashboard.associations";
import { CreateNpmsDashboardItemGqlInput, CreateNpmsDashboardItemValidator } from "../dtos/create-npms-dashboard-item.gql";
import { SoftDeleteNpmsDashboardItemGqlInput, SoftDeleteNpmsDashboardItemValidator } from "../dtos/soft-delete-npms-dashboard-item.gql";
import { NpmsDashboardItemAssociation } from "../npms-dashboard-item.associations";
import { INpmsDashboardItemGqlNodeSource, NpmsDashboardItemGqlNode } from "./npms-dashboard-item.gql.node";

export const NpmsDashboardItemGqlMutations: Thunk<GraphQLFieldConfigMap<undefined, GqlContext>> = () => ({
  createNpmsDashboardItem: {
    type: GraphQLNonNull(NpmsDashboardItemGqlNode),
    args: { dto: { type: GraphQLNonNull(CreateNpmsDashboardItemGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INpmsDashboardItemGqlNodeSource> => {
      const dto = ctx.validate(CreateNpmsDashboardItemValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
        const [dashboard, npmsPackage] = await Promise.all([
          // cannot edit if cannot see the dashboard and npms...
          ctx
            .services
            .npmsDashboardRepository
            .findByPkOrfail(dto.dashboard_id, {
              runner,
              options: {
                include: [{
                  association: NpmsDashboardAssociation.items,
                }],
              },
            }),
          ctx
            .services
            .npmsPackageRepository
            .findByPkOrfail(dto.npms_package_id, { runner }),
        ]);
        ctx.authorize(ctx.services.npmsDashboardItemPolicy.canCreate({ dashboard, npmsPackage, }));

        const items = assertDefined(dashboard.items);
        const newItem = await ctx.services.npmsDashboardItemService.create({
          runner,
          dashboard,
          npmsPackage,
          order: 0,
        });
        await ctx.services.npmsDashboardItemService.syncOrder({
          runner,
          dashboard,
          items: [newItem, ...items],
        });

        return newItem;
      });
      return model;
    },
  },

  hardDeleteNpmsDashboardItem: {
    type: GraphQLNonNull(NpmsDashboardItemGqlNode),
    args: { dto: { type: GraphQLNonNull(SoftDeleteNpmsDashboardItemGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INpmsDashboardItemGqlNodeSource> => {
      const dto = ctx.validate(SoftDeleteNpmsDashboardItemValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
        const npmsDashboardItem: NpmsDashboardItemModel = await ctx.services.npmsDashboardItemRepository.findByPkOrfail(dto.id, {
          runner,
          options: {
            include: [
              { association: NpmsDashboardItemAssociation.dashboard, },
              { association: NpmsDashboardItemAssociation.npmsPackage, },
            ],
          }
        });
        const dashboard = assertDefined(npmsDashboardItem.dashboard);
        const npmsPackage = assertDefined(npmsDashboardItem.npmsPackage);
        ctx.authorize(ctx.services.npmsDashboardItemPolicy.canHardDelete({ model: npmsDashboardItem, dashboard }));
        await ctx.services.npmsDashboardItemService.hardDelete({
          runner,
          groups: [{ dashboard, model: npmsDashboardItem, }]
        });
        return npmsDashboardItem;
      });
      return model;
    },
  },
});