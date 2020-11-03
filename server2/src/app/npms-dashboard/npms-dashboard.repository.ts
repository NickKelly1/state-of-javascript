import { ModelCtor, Order, OrderItem } from "sequelize";
import { BaseRepository } from "../../common/classes/repository.base";
import { OrUndefined } from "../../common/types/or-undefined.type";
import { NpmsDashboardField } from "./npms-dashboard.attributes";
import { NpmsDashboardModel } from "./npms-dashboard.model";

export class NpmsDashboardRepository extends BaseRepository<NpmsDashboardModel> {
  order(): OrUndefined<Order> {
    return [
      [NpmsDashboardField.order, 'ASC'],
      [NpmsDashboardField.id, 'ASC'],
    ];
  }

  protected readonly Model = NpmsDashboardModel as ModelCtor<NpmsDashboardModel>;
}
