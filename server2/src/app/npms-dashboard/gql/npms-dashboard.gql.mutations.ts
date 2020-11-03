import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { Op } from "sequelize";
import { NpmsDashboardModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { ICreateNpmsDashboardItemInput } from "../../npms-dashboard-item/dtos/create-npms-dashboard-item.gql";
import { NpmsDashboardItemField } from "../../npms-dashboard-item/npms-dashboard-item.attributes";
import { NpmsPackageField } from "../../npms-package/npms-package.attributes";
import { CreateNpmsDashboardGqlInput, CreateNpmsDashboardValidator } from "../dtos/create-npms-dashboard.gql";
import { DeleteNpmsDashboardGqlInput, DeleteNpmsDashboardValidator } from "../dtos/delete-npms-dashboard.gql";
import { UpdateNpmsDashboardGqlInput, UpdateNpmsDashboardValidator } from "../dtos/update-npms-dashboard.gql";
import { NpmsDashboardAssociation } from "../npms-dashboard.associations";
import { INpmsDashboardGqlNodeSource, NpmsDashboardGqlNode } from "./npms-dashboard.gql.node";

export const NpmsDashboardGqlMutations: Thunk<GraphQLFieldConfigMap<undefined, GqlContext>> = () => ({
  createNpmsDashboard: {
    type: GraphQLNonNull(NpmsDashboardGqlNode),
    args: { dto: { type: GraphQLNonNull(CreateNpmsDashboardGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INpmsDashboardGqlNodeSource> => {
      ctx.authorize(ctx.services.npmsDashboardPolicy.canCreate());
      const dto = ctx.validate(CreateNpmsDashboardValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
        const dashboard = await ctx.services.npmsDashboardService.create({ runner, dto });

        // link to packages
        if (dto.npms_package_ids && dto.npms_package_ids.length) {
          ctx.authorize(ctx.services.npmsDashboardItemPolicy.canCreate());
          // TODO: verify each individually can be linked...
          const nextPackages = await ctx.services.npmsPackageRepository.findAll({
            runner,
            options: {
              where: { [NpmsPackageField.id]: { [Op.in]: dto.npms_package_ids, }, },
            },
          });
          await ctx.services.npmsDashboardService.syncItems({
            runner,
            dashboard,
            nextPackages,
            prevDashboardItems: [],
          });
        }

        return dashboard;
      });
      return model;
    },
  },

  updateNpmsDashboard: {
    type: GraphQLNonNull(NpmsDashboardGqlNode),
    args: { dto: { type: GraphQLNonNull(UpdateNpmsDashboardGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INpmsDashboardGqlNodeSource> => {
      const dto = ctx.validate(UpdateNpmsDashboardValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
        const dashboard: NpmsDashboardModel = await ctx.services.npmsDashboardRepository.findByPkOrfail(dto.id, {
          runner,
          options: {
            include: [{ association: NpmsDashboardAssociation.items, }],
          }
        });
        await ctx.services.npmsDashboardService.update({ runner, dto, model: dashboard });

        ctx.authorize(ctx.services.npmsDashboardPolicy.canUpdate({ model: dashboard }));
        // link to packages
        if (dto.npms_package_ids && dto.npms_package_ids.length) {
          const prevDashboardItems = assertDefined(dashboard.items);
          ctx.authorize(ctx.services.npmsDashboardItemPolicy.canCreate());
          // TODO: verify each individually can be linked...
          const nextPackages = await ctx.services.npmsPackageRepository.findAll({
            runner,
            options: {
              where: { [NpmsPackageField.id]: { [Op.in]: dto.npms_package_ids, }, },
            },
          });
          await ctx.services.npmsDashboardService.syncItems({
            runner,
            dashboard,
            nextPackages,
            prevDashboardItems,
          });
        }

        return dashboard;
      });
      return model;
    },
  },

  deleteNpmsDashboard: {
    type: GraphQLNonNull(NpmsDashboardGqlNode),
    args: { dto: { type: GraphQLNonNull(DeleteNpmsDashboardGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INpmsDashboardGqlNodeSource> => {
      const dto = ctx.validate(DeleteNpmsDashboardValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
        const npmsDashboard: NpmsDashboardModel = await ctx.services.npmsDashboardRepository.findByPkOrfail(dto.id, {
          runner,
        });
        ctx.authorize(ctx.services.npmsDashboardPolicy.canDelete({ model: npmsDashboard }));
        await ctx.services.npmsDashboardService.delete({ runner, model: npmsDashboard });
        return npmsDashboard;
      });
      return model;
    },
  },
});