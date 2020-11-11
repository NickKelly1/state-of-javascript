import { NpmsDashboardModel } from '../../circle';
import { assertDefined } from '../../common/helpers/assert-defined.helper';
import { Combinator } from '../../common/helpers/combinator.helper';
import { ist } from '../../common/helpers/ist.helper';
import { IRequestContext } from '../../common/interfaces/request-context.interface';
import { OrNull } from '../../common/types/or-null.type';
import { OrNullable } from '../../common/types/or-nullable.type';
import { QueryRunner } from '../db/query-runner';
import { NpmsDashboardItemField } from '../npms-dashboard-item/npms-dashboard-item.attributes';
import { NpmsDashboardItemModel } from '../npms-dashboard-item/npms-dashboard-item.model';
import { NpmsPackageModel } from '../npms-package/npms-package.model';
import { ICreateNpmsDashboardInput } from './dtos/create-npms-dashboard.gql';
import { ISortNpmsDashboardInput } from './dtos/sort-npms-dashboard.gql';
import { IUpdateNpmsDashboardInput } from './dtos/update-npms-dashboard.gql';
import { NpmsDashboardField } from './npms-dashboard.attributes';

export class NpmsDashboardService {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  async create(arg: {
    runner: QueryRunner;
    dto: ICreateNpmsDashboardInput,
  }): Promise<NpmsDashboardModel> {
    const { runner, dto } = arg;
    const { transaction } = runner;

    // get highest order...
    const count = await NpmsDashboardModel.count({ transaction });
    const NpmsDashboard = NpmsDashboardModel.build({ name: dto.name, order: count - 1, });
    await NpmsDashboard.save({ transaction });

    return NpmsDashboard;
  }

  /**
   * Sort all dashboards
   *
   * @param arg
   */
  async sortDashboards(arg: {
    runner: QueryRunner;
    dto: ISortNpmsDashboardInput;
  }): Promise<void> {
    const { runner, dto } = arg;
    const { transaction } = runner;

    const givenDashboardIdSet = new Set(dto.dashboard_ids);
    const allDashboardsMap = await this.ctx
      .services
      .npmsDashboardRepository
      .findAll({
        runner,
        unscoped: true,
        options: {
          attributes: [
            NpmsDashboardField.id,
            NpmsDashboardField.order,
          ],
          // ensure ordering
          order: [[NpmsDashboardItemField.order, 'ASC']]
        },
      })
      .then(results => new Map(results.map(result => [result.id, result])));

    const final: NpmsDashboardModel[] = (Array
      // use the given ordering
      .from(givenDashboardIdSet)
      .map(dashboard_id => this.ctx.assertFound(allDashboardsMap.get(dashboard_id))) as OrNull<NpmsDashboardModel>[])
      // append anything that wasn't given to the end
      .concat(...Array
        .from(allDashboardsMap.values())
        .map(otherDashboard => (givenDashboardIdSet.has(otherDashboard.id))
          // already been sorted? null it
          ? null
          : otherDashboard
        )
      )
      // remove null holes from already-ordered items
      .filter(ist.notNull);

    // set the new order for each model
    final.forEach((model, i) => model.order = i);
    // save all
    await Promise.all(final.map(model => model.save({ transaction })));
  }


  /**
   * Synchronise dashboard items
   *
   * @param arg
   */
  async syncItems(arg: {
    runner: QueryRunner;
    dashboard: NpmsDashboardModel;
    prevDashboardItems: NpmsDashboardItemModel[];
    nextPackages: NpmsPackageModel[];
  }): Promise<NpmsDashboardItemModel[]> {
    const { runner, dashboard, prevDashboardItems, nextPackages } = arg;
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
    const normal = Array.from(combinator.bJoinA.a.values());

    // synchronise items
    const [_, createdLinkages] = await Promise.all([
      // destroy unexpected
      Promise.all(unexpected.map(itemToDestroy => itemToDestroy.destroy({ transaction }))),
      // add missing
      Promise.all(missing.map(async (missingPackage, i) => {
        const nextLinkage = await this
          .ctx
          .services
          .npmsDashboardItemService
          .create({
            runner,
            order: i,
            dashboard,
            npmsPackage: missingPackage,
          });
        return nextLinkage;
      })),
    ]);

    // synchronise order of the linkages
    const orderedLinkages = await this.ctx.services.npmsDashboardItemService.syncOrder({
      runner,
      dashboard,
      items: [...createdLinkages, ...normal,],
    });

    return orderedLinkages;
  }


  /**
   * Update the model
   *
   * @param arg
   */
  async update(arg: {
    runner: QueryRunner;
    model: NpmsDashboardModel;
    dto: IUpdateNpmsDashboardInput,
  }): Promise<NpmsDashboardModel> {
    const { runner, model, dto } = arg;
    const { transaction } = runner;
    if (ist.notNullable(dto.name)) model.name = dto.name;
    await model.save({ transaction });
    return model;
  }


  /**
   * Soft delete the model
   * 
   * @param arg
   */
  async softDelete(arg: {
    model: NpmsDashboardModel;
    items: NpmsDashboardItemModel[];
    runner: QueryRunner;
  }): Promise<NpmsDashboardModel> {
    const { model, runner } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction });
    return model;
  }


  /**
   * Hard delete the model
   * 
   * @param arg
   */
  async hardDelete(arg: {
    model: NpmsDashboardModel;
    items: NpmsDashboardItemModel[]
    runner: QueryRunner;
  }): Promise<NpmsDashboardModel> {
    const { model, runner, items } = arg;
    const { transaction } = runner;
    // hard delete all associated items..
    await Promise.all(items.map(item => item.destroy({ transaction })));
    // hard delete dashboard
    await model.destroy({ transaction, force: true });
    return model;
  }
}
