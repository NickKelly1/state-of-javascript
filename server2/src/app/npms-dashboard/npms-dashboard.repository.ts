import { ModelCtor } from "sequelize";
import { BaseRepository } from "../../common/classes/repository.base";
import { NpmsDashboardModel } from "./npms-dashboard.model";

export class NpmsDashboardRepository extends BaseRepository<NpmsDashboardModel> {
  protected readonly Model = NpmsDashboardModel as ModelCtor<NpmsDashboardModel>;
}
