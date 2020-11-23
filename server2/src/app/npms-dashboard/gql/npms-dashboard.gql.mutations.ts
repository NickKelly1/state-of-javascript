import { GraphQLBoolean, GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { Op } from "sequelize";
import { NpmsDashboardModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { NpmsPackageField } from "../../npms-package/npms-package.attributes";
import { CreateNpmsDashboardGqlInput, CreateNpmsDashboardValidator } from "../gql-input/create-npms-dashboard.gql";
import { SoftDeleteNpmsDashboardGqlInput, SoftDeleteNpmsDashboardGqlInputValidator } from "../gql-input/soft-delete-npms-dashboard.gql";
import { RestoreNpmsDashboardGqlInput, RestoreNpmsDashboardGqlInputValidator } from "../gql-input/restore-npms-dashboard.gql";
import { SortNpmsDashboardGqlInput, SortNpmsDashboardValidator } from "../gql-input/sort-npms-dashboard.gql";
import { UpdateNpmsDashboardGqlInput, UpdateNpmsDashboardValidator } from "../gql-input/update-npms-dashboard.gql";
import { NpmsDashboardAssociation } from "../npms-dashboard.associations";
import { INpmsDashboardGqlNodeSource, NpmsDashboardGqlNode } from "./npms-dashboard.gql.node";
import { HardDeleteNpmsDashboardGqlInput } from "../gql-input/hard-delete-npms-dashboard.gql";
import { INpmsDashboardServiceCreateNpmsDashboardDto } from "../dto/npms-dashboard-service.create-npms-dashboard.dto";
import { INpmsDashboardServiceUpdateNpmsDashboardDto } from "../dto/npms-dashboard-service.update-npms-dashboard.dto";
import { NpmsDashboardStatus } from "../../npms-dashboard-status/npms-dashboard-status.const";
import { SubmitNpmsDashboardGqlInput, SubmitNpmsDashboardGqlInputValidator } from "../gql-input/submit-npms-dashboard.gql";
import { RejectNpmsDashboardGqlInput, RejectNpmsDashboardGqlInputValidator } from "../gql-input/reject-npms-dashboard.gql";
import { ApproveNpmsDashboardGqlInput, ApproveNpmsDashboardGqlInputValidator } from "../gql-input/approve-npms-dashboard.gql";
import { UnpublishNpmsDashboardGqlInput, UnpublishNpmsDashboardGqlInputValidator } from "../gql-input/unpublish-npms-dashboard.gql";
import { PublishNpmsDashboardGqlInput, PublishNpmsDashboardGqlInputValidator } from "../gql-input/publish-npms-dashboard.gql";

export const NpmsDashboardGqlMutations: Thunk<GraphQLFieldConfigMap<undefined, GqlContext>> = () => ({
  sortNpmsDashboards: {
    type: GraphQLNonNull(GraphQLBoolean),
    args: { dto: { type: GraphQLNonNull(SortNpmsDashboardGqlInput) } },
    resolve: async (parent, args, ctx): Promise<boolean> => {
      ctx.authorize(ctx.services.npmsDashboardPolicy.canSort());
      const dto = ctx.validate(SortNpmsDashboardValidator, args.dto);
      await ctx.services.universal.db.transact(async ({ runner }) => {
        await ctx.services.npmsDashboardService.sortDashboards({ runner, dto });
      });
      return true;
    },
  },

  createNpmsDashboard: {
    type: GraphQLNonNull(NpmsDashboardGqlNode),
    args: { dto: { type: GraphQLNonNull(CreateNpmsDashboardGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INpmsDashboardGqlNodeSource> => {
      ctx.authorize(ctx.services.npmsDashboardPolicy.canCreate());
      const dto = ctx.validate(CreateNpmsDashboardValidator, args.dto);
      const owner_id = ctx.assertAuthentication();
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const owner = await ctx.services.userRepository.findByPkOrfail(owner_id, { runner, unscoped: true });
        const serviceDto: INpmsDashboardServiceCreateNpmsDashboardDto = {
          name: dto.name,
          npms_package_ids: dto.npms_package_ids,
          status_id: NpmsDashboardStatus.Draft,
        };
        const dashboard = await ctx.services.npmsDashboardService.create({ runner, dto: serviceDto, owner });

        // link to packages
        if (dto.npms_package_ids && dto.npms_package_ids.length) {
          ctx.authorize(ctx.services.npmsDashboardItemPolicy.canCreate({ dashboard }));
          // TODO: verify each individually can be linked...
          const nextPackagesUnsorted = await ctx
            .services
            .npmsPackageRepository
            .findAll({
              runner,
              options: {
                where: { [NpmsPackageField.id]: { [Op.in]: dto.npms_package_ids, }, },
              },
            })
          .then(pkgs => new Map(pkgs.map(pkg => [pkg.id, pkg])));
          const nextPackages = dto.npms_package_ids.map(id => ctx.assertFound(nextPackagesUnsorted.get(id)));
          await ctx.services.npmsDashboardService.syncItems({
            runner,
            dashboard,
            nextPackages,
            prevDashboardItems: [],
          });
          // move this dashboard to the front...
          await ctx.services.npmsDashboardService.sortDashboards({
            runner,
            dto: { dashboard_ids: [dashboard.id], },
          });
        }

        return dashboard;
      });
      return final;
    },
  },

  updateNpmsDashboard: {
    type: GraphQLNonNull(NpmsDashboardGqlNode),
    args: { dto: { type: GraphQLNonNull(UpdateNpmsDashboardGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INpmsDashboardGqlNodeSource> => {
      const dto = ctx.validate(UpdateNpmsDashboardValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const dashboard: NpmsDashboardModel = await ctx.services.npmsDashboardRepository.findByPkOrfail(dto.id, {
          runner,
          options: {
            include: [{ association: NpmsDashboardAssociation.items, }],
          }
        });
        const serviceDto: INpmsDashboardServiceUpdateNpmsDashboardDto = {
          name: dto.name,
        };
        await ctx.services.npmsDashboardService.update({ runner, dto, model: dashboard });

        ctx.authorize(ctx.services.npmsDashboardPolicy.canUpdate({ model: dashboard }));
        // link to packages
        if (dto.npms_package_ids && dto.npms_package_ids.length) {
          const prevDashboardItems = assertDefined(dashboard.items);
          ctx.authorize(ctx.services.npmsDashboardItemPolicy.canCreate({ dashboard }));
          // TODO: verify each individually can be linked...
          const nextPackagesUnsorted = await ctx
            .services
            .npmsPackageRepository
            .findAll({
              runner,
              options: {
                where: { [NpmsPackageField.id]: { [Op.in]: dto.npms_package_ids, }, },
              },
            })
          .then(pkgs => new Map(pkgs.map(pkg => [pkg.id, pkg])));
          const nextPackages = dto.npms_package_ids.map(id => ctx.assertFound(nextPackagesUnsorted.get(id)));
          await ctx.services.npmsDashboardService.syncItems({
            runner,
            dashboard,
            nextPackages,
            prevDashboardItems,
          });
        }

        return dashboard;
      });
      return final;
    },
  },


  softDeleteNpmsDashboard: {
    args: { dto: { type: GraphQLNonNull(SoftDeleteNpmsDashboardGqlInput) } },
    type: GraphQLNonNull(GraphQLBoolean),
    resolve: async (parent, args, ctx): Promise<boolean> => {
      const dto = ctx.validate(SoftDeleteNpmsDashboardGqlInputValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const npmsDashboard: NpmsDashboardModel = await ctx.services.npmsDashboardRepository.findByPkOrfail(dto.id, {
          runner,
        });
        ctx.authorize(ctx.services.npmsDashboardPolicy.canSoftDelete({ model: npmsDashboard }));
        await ctx.services.npmsDashboardService.softDelete({ runner, model: npmsDashboard });
        return npmsDashboard;
      });
      return true;
    },
  },


  hardDeleteNpmsDashboard: {
    args: { dto: { type: GraphQLNonNull(HardDeleteNpmsDashboardGqlInput) } },
    type: GraphQLNonNull(GraphQLBoolean),
    resolve: async (parent, args, ctx): Promise<boolean> => {
      const dto = ctx.validate(SoftDeleteNpmsDashboardGqlInputValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const npmsDashboard: NpmsDashboardModel = await ctx.services.npmsDashboardRepository.findByPkOrfail(dto.id, {
          runner,
          options: {
            include: [{ association: NpmsDashboardAssociation.items, }],
          }
        });
        ctx.authorize(ctx.services.npmsDashboardPolicy.canHardDelete({ model: npmsDashboard }));
        const items = assertDefined(npmsDashboard.items);
        await ctx.services.npmsDashboardService.hardDelete({ runner, model: npmsDashboard, items });
        return npmsDashboard;
      });
      return true;
    },
  },


  restoreNpmsDashboard: {
    type: GraphQLNonNull(NpmsDashboardGqlNode),
    args: { dto: { type: GraphQLNonNull(RestoreNpmsDashboardGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INpmsDashboardGqlNodeSource> => {
      const dto = ctx.validate(RestoreNpmsDashboardGqlInputValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const npmsDashboard: NpmsDashboardModel = await ctx.services.npmsDashboardRepository.findByPkOrfail(dto.id, {
          runner,
        });
        ctx.authorize(ctx.services.npmsDashboardPolicy.canRestore({ model: npmsDashboard }));
        await ctx.services.npmsDashboardService.restore({ runner, model: npmsDashboard });
        return npmsDashboard;
      });
      return final;
    },
  },


  submitNpmsDashboard: {
    type: GraphQLNonNull(NpmsDashboardGqlNode),
    args: { dto: { type: GraphQLNonNull(SubmitNpmsDashboardGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INpmsDashboardGqlNodeSource> => {
      const dto = ctx.validate(SubmitNpmsDashboardGqlInputValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const npmsDashboard: NpmsDashboardModel = await ctx.services.npmsDashboardRepository.findByPkOrfail(dto.id, {
          runner,
        });
        ctx.authorize(ctx.services.npmsDashboardPolicy.canSubmit({ model: npmsDashboard }));
        await ctx.services.npmsDashboardService.submit({ runner, model: npmsDashboard });
        return npmsDashboard;
      });
      return final;
    },
  },


  rejectNpmsDashboard: {
    type: GraphQLNonNull(NpmsDashboardGqlNode),
    args: { dto: { type: GraphQLNonNull(RejectNpmsDashboardGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INpmsDashboardGqlNodeSource> => {
      const dto = ctx.validate(RejectNpmsDashboardGqlInputValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const npmsDashboard: NpmsDashboardModel = await ctx.services.npmsDashboardRepository.findByPkOrfail(dto.id, {
          runner,
        });
        ctx.authorize(ctx.services.npmsDashboardPolicy.canReject({ model: npmsDashboard }));
        await ctx.services.npmsDashboardService.reject({ runner, model: npmsDashboard });
        return npmsDashboard;
      });
      return final;
    },
  },


  approveNpmsDashboard: {
    type: GraphQLNonNull(NpmsDashboardGqlNode),
    args: { dto: { type: GraphQLNonNull(ApproveNpmsDashboardGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INpmsDashboardGqlNodeSource> => {
      const dto = ctx.validate(ApproveNpmsDashboardGqlInputValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const npmsDashboard: NpmsDashboardModel = await ctx.services.npmsDashboardRepository.findByPkOrfail(dto.id, {
          runner,
        });
        ctx.authorize(ctx.services.npmsDashboardPolicy.canApprove({ model: npmsDashboard }));
        await ctx.services.npmsDashboardService.approve({ runner, model: npmsDashboard });
        return npmsDashboard;
      });
      return final;
    },
  },


  publishNpmsDashboard: {
    type: GraphQLNonNull(NpmsDashboardGqlNode),
    args: { dto: { type: GraphQLNonNull(PublishNpmsDashboardGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INpmsDashboardGqlNodeSource> => {
      const dto = ctx.validate(PublishNpmsDashboardGqlInputValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const npmsDashboard: NpmsDashboardModel = await ctx.services.npmsDashboardRepository.findByPkOrfail(dto.id, {
          runner,
        });
        ctx.authorize(ctx.services.npmsDashboardPolicy.canPublish({ model: npmsDashboard }));
        await ctx.services.npmsDashboardService.publish({ runner, model: npmsDashboard });
        return npmsDashboard;
      });
      return final;
    },
  },


  unpublishNpmsDashboard: {
    type: GraphQLNonNull(NpmsDashboardGqlNode),
    args: { dto: { type: GraphQLNonNull(UnpublishNpmsDashboardGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INpmsDashboardGqlNodeSource> => {
      const dto = ctx.validate(UnpublishNpmsDashboardGqlInputValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const npmsDashboard: NpmsDashboardModel = await ctx.services.npmsDashboardRepository.findByPkOrfail(dto.id, {
          runner,
        });
        ctx.authorize(ctx.services.npmsDashboardPolicy.canUnpublish({ model: npmsDashboard }));
        await ctx.services.npmsDashboardService.unpublish({ runner, model: npmsDashboard });
        return npmsDashboard;
      });
      return final;
    },
  }
});