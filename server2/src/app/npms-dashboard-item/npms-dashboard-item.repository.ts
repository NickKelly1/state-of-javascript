import { ModelCtor, Order } from "sequelize";
import { BaseRepository } from "../../common/classes/repository.base";
import { OrUndefined } from "../../common/types/or-undefined.type";
import { NpmsDashboardItemField } from "./npms-dashboard-item.attributes";
import { NpmsDashboardItemModel } from "./npms-dashboard-item.model";

export class NpmsDashboardItemRepository extends BaseRepository<NpmsDashboardItemModel> {
  order(): OrUndefined<Order> {
    return [
      [NpmsDashboardItemField.npms_package_id, 'ASC'],
      [NpmsDashboardItemField.order, 'ASC'],
      [NpmsDashboardItemField.id, 'ASC'],
    ];
  }

  protected readonly Model = NpmsDashboardItemModel as ModelCtor<NpmsDashboardItemModel>;
}
