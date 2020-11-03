
import { ModelCtor, Order } from "sequelize";
import { BaseRepository } from "../../common/classes/repository.base";
import { OrUndefined } from "../../common/types/or-undefined.type";
import { NpmsDashboardItemField } from "../npms-dashboard-item/npms-dashboard-item.attributes";
import { NpmsPackageAssociation } from "./npms-package.associations";
import { NpmsPackageField } from "./npms-package.attributes";
import { NpmsPackageModel } from "./npms-package.model";

export class NpmsPackageRepository extends BaseRepository<NpmsPackageModel> {
  order(): OrUndefined<Order> {
    return [
      [NpmsPackageField.name, 'ASC'],
    ];
  }

  protected readonly Model = NpmsPackageModel as ModelCtor<NpmsPackageModel>;
}