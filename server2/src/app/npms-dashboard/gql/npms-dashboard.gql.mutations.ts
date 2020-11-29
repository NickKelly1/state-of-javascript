import { GraphQLBoolean, GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { Op, or } from "sequelize";
import { NpmsDashboardItemModel, NpmsDashboardModel } from "../../../circle";
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
import { UnauthenticatedException } from "../../../common/exceptions/types/unauthenticated.exception";
import { ist } from "../../../common/helpers/ist.helper";
import { orWhere } from "../../../common/helpers/or-where.helper.ts";
import { NpmsPackageModel } from "../../npms-package/npms-package.model";
import { NpmsLang } from "../../../common/i18n/packs/npms.lang";
import { BadRequestException } from "../../../common/exceptions/types/bad-request.exception";
import { toMapArrBy, toMapBy, toMapById } from "../../../common/helpers/to-id-map.helper";
import { NpmsPackageId } from "../../npms-package/npms-package.id.type";
import { IRequestContext } from "../../../common/interfaces/request-context.interface";
import { OrNullable } from "../../../common/types/or-nullable.type";
import { QueryRunner } from "../../db/query-runner";
import { OrUndefined } from "../../../common/types/or-undefined.type";
import { Combinator } from "../../../common/helpers/combinator.helper";
import { InternalServerError } from "http-errors";
import { InternalServerException } from "../../../common/exceptions/types/internal-server.exception";

/**
 * NpmsDashboard Mutations
 */
export const NpmsDashboardGqlMutations: Thunk<GraphQLFieldConfigMap<undefined, GqlContext>> = () => ({
  /**
   * Sort all NpmsDashboards, given a subset
   */
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


  /**
   * Create an NpmsDashboard
   */
  createNpmsDashboard: {
    type: GraphQLNonNull(NpmsDashboardGqlNode),
    args: { dto: { type: GraphQLNonNull(CreateNpmsDashboardGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INpmsDashboardGqlNodeSource> => {
      ctx.authorize(ctx.services.npmsDashboardPolicy.canCreate());
      const dto = ctx.validate(CreateNpmsDashboardValidator, args.dto);

      // require authentication...
      const owner_id = ctx.auth.user_id;
      // convert empty string to null...
      const shadow_id = ctx.auth.shadow_id || null;

      if (ist.nullable(owner_id) && ist.nullable(shadow_id)) {
        throw ctx.except(UnauthenticatedException());
      }

      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const owner = ist.defined(owner_id)
          ? await ctx.services.userRepository.findByPkOrfail(owner_id, { runner, unscoped: true })
          : null;
        const serviceDto: INpmsDashboardServiceCreateNpmsDashboardDto = {
          name: dto.name,
          status_id: NpmsDashboardStatus.Draft,
          shadow_id,
        };
        const dashboard = await ctx.services.npmsDashboardService.create({ runner, dto: serviceDto, owner });
        const nextPackages = await findOrCreateNpmsPackages({
          ctx,
          dashboard,
          runner,
          findIds: { values: dto.npms_package_ids, key: 'npms_package_ids', },
          findNames: { values: dto.npms_package_names, key: 'npms_package_names', },
        });
        if (Array.isArray(nextPackages)) {
          await syncItems({
            ctx,
            dashboard,
            nextPackages,
            prevDashboardItems: [],
            runner,
          });
        }

        // move this dashboard to the front...
        await ctx.services.npmsDashboardService.sortDashboards({
          runner,
          dto: { dashboard_ids: [dashboard.id], },
        });

        return dashboard;
      });

      return final;
    },
  },


  /**
   * Update an NpmsDashboard
   */
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
        const prevDashboardItems = assertDefined(dashboard.items);
        const serviceDto: INpmsDashboardServiceUpdateNpmsDashboardDto = {
          name: dto.name,
        };
        ctx.authorize(ctx.services.npmsDashboardPolicy.canUpdate({ model: dashboard }));
        await ctx.services.npmsDashboardService.update({ runner, dto: serviceDto, model: dashboard });
        const nextPackages = await findOrCreateNpmsPackages({
          ctx,
          dashboard,
          runner,
          findIds: { values: dto.npms_package_ids, key: 'npms_package_ids', },
          findNames: { values: dto.npms_package_names, key: 'npms_package_names', },
        });
        if (Array.isArray(nextPackages)) {
          await syncItems({
            ctx,
            dashboard,
            nextPackages,
            prevDashboardItems,
            runner,
          });
        }

        return dashboard;
      });
      return final;
    },
  },


  /**
   * SoftDelete an NpmsDashboard
   */
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


  /**
   * HardDelete an NpmsDashboard
   */
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


  /**
   * Restore an NpmsDashboard
   */
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


  /**
   * Submit an NpmsDashboard
   */
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


  /**
   * Reject an NpmsDashboard
   */
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


  /**
   * Approve an NpmsDashboard
   */
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


  /**
   * Publish an NpmsDashboard
   */
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


  /**
   * Unpublish an NpmsDashboard
   */
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




/**
 * Attempt to Find or Create a set of Npms Packages, using the Requesters Authentication
 *
 * @param arg
 */
async function findOrCreateNpmsPackages(arg: {
  ctx: IRequestContext;
  dashboard: NpmsDashboardModel;
  findNames?: OrNullable<{ key: string; values: OrNullable<string[]>; }>;
  findIds?: OrNullable<{ key: string; values: OrNullable<NpmsPackageId[]> }>;
  runner: QueryRunner;
}): Promise<OrUndefined<NpmsPackageModel[]>> {
  const { ctx, findNames, findIds, runner, dashboard, } = arg;

  const _findNames = findNames?.values || [];
  const _findIds = findIds?.values || [];

  // link to packages

  if (!_findNames.length && !_findIds.length) {
    // nothing to find....
    return undefined;
  }

  const _where = orWhere([
    _findIds.length ? { [NpmsPackageField.id]: { [Op.in]: _findIds, }, } : null,
    _findNames.length ? { [NpmsPackageField.name]: { [Op.in]: _findNames, }, } : null,
  ]);

  const nextPackagesUnsorted = await ctx
    .services
    .npmsPackageRepository
    .findAll({ runner, options: { where: _where, }, })
    .then(pkgs => ({ byId: toMapBy(pkgs, 'id'), byName: toMapBy(pkgs, 'name'), }));

  const nextPackages: Map<NpmsPackageId, NpmsPackageModel> = new Map();
  const missedNames: string[] = [];
  const missedIds: number[] = [];

  // extract desired packages by id
  _findIds.forEach(id => {
    const match = nextPackagesUnsorted.byId.get(id);
    if (match) nextPackages.set(match.id, match);
    else missedIds.push(id);
  });

  // extract desired packages by name
  _findNames.forEach(name => {
    const match = nextPackagesUnsorted.byName.get(name);
    if (match) nextPackages.set(match.id, match);
    else missedNames.push(name);
  });

  // validate all ids matched
  if (missedIds.length) {
    const message = ctx.lang(NpmsLang.NpmsIdsNotFound({ ids: missedIds }));
    throw ctx.except(BadRequestException({
      message,
      ...(findIds?.key ? { data: { [findIds?.key]: [message], } } : {}),
    }))
  }

  // query npms for missing names
  if (missedNames.length) {
    ctx.authorize(ctx.services.npmsPackagePolicy.canCreate());
    const newPackages = await ctx
      .services
      .npmsPackageService
      .create({ runner, dto: { names: missedNames }})
      .then(pkgs => toMapBy(pkgs, 'name'));

    // find names that are still missing
    const doubleMissedNames: string[] = [];
    missedNames.forEach(name => {
      const match = newPackages.get(name);
      if (!match) doubleMissedNames.push(name);
      else nextPackages.set(match.id, match);
    });

    // validate all names were eventually found
    if (doubleMissedNames.length) {
      const message = ctx.lang(NpmsLang.NpmsNamesNotFound({ names: doubleMissedNames }));
      throw ctx.except(BadRequestException({
        message,
      ...(findNames?.key ? { data: { [findNames.key]: [message], } } : {}),
      }))
    }
  }

  return Array.from(nextPackages.values());
}




/**
 * Synchronise NpmsDashboardItems for an NpmsDashboard
 *
 * @param arg
 */
async function syncItems(arg: {
  ctx: IRequestContext,
  runner: QueryRunner;
  dashboard: NpmsDashboardModel;
  prevDashboardItems: NpmsDashboardItemModel[];
  nextPackages: NpmsPackageModel[];
}): Promise<NpmsDashboardItemModel[]> {
  const { runner, ctx, dashboard, prevDashboardItems, nextPackages } = arg;
  const { transaction } = runner;

  const combinator = new Combinator({
    // a => previous items
    a: new Map(prevDashboardItems.map(itm => [itm.npms_package_id, itm])),
    // b => next items
    b: new Map(nextPackages.map(pkg => [pkg.id, pkg])),
  });
  // in previous but not next
  const unexpected = Array.from(combinator.diff.aNotB.values());
  // in next but not previous
  const missing = Array.from(combinator.diff.bNotA.values());
  // already exist
  const normal = combinator.bJoinA.a;

  // authorise creation
  missing.forEach(npmsPackage => ctx.authorize(ctx
    .services
    .npmsDashboardItemPolicy
    .canCreate({ dashboard, npmsPackage: npmsPackage })));

  // authorise deletion
  unexpected.forEach(model => ctx.authorize(ctx
    .services
    .npmsDashboardItemPolicy
    .canHardDelete({ dashboard, model })));

  // synchronise items
  const [_, createdLinkages] = await Promise.all([
    // destroy unexpected
    unexpected.length ?
      ctx.services.npmsDashboardItemService.hardDelete({
        runner,
        groups: unexpected.map(model => ({ dashboard, model })),
      })
      : Promise.resolve(null),
    // add missing
    Promise.all(missing.map(async (missingPackage, i) => {
      const nextLinkages = await ctx
        .services
        .npmsDashboardItemService
        .create({
          runner,
          order: i,
          dashboard,
          npmsPackage: missingPackage,
        });
      return nextLinkages;
    })).then(linkages => toMapBy(linkages, 'npms_package_id')),
  ]);

  // extract existing & created into the desired order
  const newOrder: NpmsDashboardItemModel[] = [];
  nextPackages.forEach(nextPackage => {
    // item was was just created
    let match = createdLinkages.get(nextPackage.id);
    if (match) { return newOrder.push(match); }
    // item already existed
    match = normal.get(nextPackage.id);
    if (match) { return newOrder.push(match); }
    // something went wrong in our logic?
    throw ctx.except(InternalServerException());
  });

  // synchronise the desired order
  const orderedLinkages = await ctx
    .services
    .npmsDashboardItemService
    .syncOrder({
      runner,
      dashboard,
      items: newOrder,
    });

  return orderedLinkages;
}