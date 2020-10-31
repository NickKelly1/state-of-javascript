import { NpmsDashboardModel } from '../../circle';
import { ist } from '../../common/helpers/ist.helper';
import { IRequestContext } from '../../common/interfaces/request-context.interface';
import { QueryRunner } from '../db/query-runner';
import { ICreateNpmsDashboardInput } from './dtos/create-npms-dashboard.gql';
import { IUpdateNpmsDashboardInput } from './dtos/update-npms-dashboard.gql';

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

    const NpmsDashboard = NpmsDashboardModel.build({
      name: dto.name,
    });

    await NpmsDashboard.save({ transaction });
    return NpmsDashboard;
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
    if (ist.notUndefined(dto.name)) model.name = dto.name;
    await model.save({ transaction });
    return model;
  }

  /**
   * Delete the model
   * 
   * @param arg
   */
  async delete(arg: {
    model: NpmsDashboardModel;
    runner: QueryRunner;
  }): Promise<NpmsDashboardModel> {
    const { model, runner } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction });
    return model;
  }
}
