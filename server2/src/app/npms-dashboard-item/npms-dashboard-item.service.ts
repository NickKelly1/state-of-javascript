import { NpmsDashboardItemModel } from '../../circle';
import { IRequestContext } from '../../common/interfaces/request-context.interface';
import { QueryRunner } from '../db/query-runner';
import { NpmsDashboardModel } from '../npms-dashboard/npms-dashboard.model';
import { NpmsPackageModel } from '../npms-package/npms-package.model';
import { ICreateNpmsDashboardItemInput } from './dtos/create-npms-dashboard-item.gql';

export class NpmsDashboardItemService {
  constructor(
    protected readonly ctx: IRequestContext,
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
    dto: ICreateNpmsDashboardItemInput,
  }): Promise<NpmsDashboardItemModel> {
    const { runner, npmsPackage, dashboard, dto } = arg;
    const { transaction } = runner;

    const NpmsDashboardItem = NpmsDashboardItemModel.build({
      dashboard_id: dashboard.id,
      npms_package_id: npmsPackage.id,
    });

    await NpmsDashboardItem.save({ transaction });
    return NpmsDashboardItem;
  }

  /**
   * Delete the model
   * 
   * @param arg
   */
  async delete(arg: {
    model: NpmsDashboardItemModel;
    npmsPackage: NpmsPackageModel;
    dashboard: NpmsDashboardModel;
    runner: QueryRunner;
  }): Promise<NpmsDashboardItemModel> {
    const { model, runner } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction });
    return model;
  }
}
