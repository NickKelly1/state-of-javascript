import { NpmsDashboardItemModel } from '../../circle';
import { BaseContext } from '../../common/context/base.context';
import { QueryRunner } from '../db/query-runner';
import { NpmsDashboardModel } from '../npms-dashboard/npms-dashboard.model';
import { NpmsPackageModel } from '../npms-package/npms-package.model';

export class NpmsDashboardItemService {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }

  /**
   * Create the model
   *
   * @param arg
   */
  async create(arg: {
    runner: QueryRunner;
    npmsPackage: NpmsPackageModel;
    dashboard: NpmsDashboardModel;
    order: number;
  }): Promise<NpmsDashboardItemModel> {
    const { runner, npmsPackage, dashboard, order } = arg;
    const { transaction } = runner;

    const NpmsDashboardItem = NpmsDashboardItemModel.build({
      dashboard_id: dashboard.id,
      npms_package_id: npmsPackage.id,
      order,
    });

    await NpmsDashboardItem.save({ transaction });
    return NpmsDashboardItem;
  }


  /**
   * Synchronise the order of dashboard items
   *
   * @param arg
   */
  async syncOrder(arg: {
    runner: QueryRunner;
    dashboard: NpmsDashboardModel;
    items: NpmsDashboardItemModel[];
  }): Promise<NpmsDashboardItemModel[]> {
    const { runner, dashboard, items } = arg;
    const { transaction } = runner;
    await Promise.all(
      items
        .map((item, i) => ({ item, expected: i }))
        .filter(({ item, expected }) => item.order !== expected)
        .map(async ({ item, expected }) => {
          item.order = expected;
          await item.save({ transaction });
        }),
    );
    return items;
  }


  /**
   * HardDelete the model
   * 
   * @param arg
   */
  async hardDelete(arg: {
    groups: {
      dashboard: NpmsDashboardModel;
      model: NpmsDashboardItemModel;
    }[]
    runner: QueryRunner;
  }): Promise<void> {
    const { runner, groups } = arg;
    const { transaction } = runner;
    await Promise.all(groups.map(group => group.model.destroy({ transaction })));
    return;
  }
}
