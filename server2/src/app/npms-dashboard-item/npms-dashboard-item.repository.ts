import { ModelCtor } from "sequelize";
import { BaseRepository } from "../../common/classes/repository.base";
import { NpmsDashboardItemModel } from "./npms-dashboard-item.model";

export class NpmsDashboardItemRepository extends BaseRepository<NpmsDashboardItemModel> {
  protected readonly Model = NpmsDashboardItemModel as ModelCtor<NpmsDashboardItemModel>;
}
