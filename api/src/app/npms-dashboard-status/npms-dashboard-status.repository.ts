import { Model, ModelCtor } from "sequelize";
import { BaseRepository } from "../../common/classes/repository.base";
import { UserPasswordModel } from "../user-password/user-password.model";
import { NpmsDashboardStatusModel } from "./npms-dashboard-status.model";


export class NpmsDashboardStatusRepository extends BaseRepository<NpmsDashboardStatusModel> {
  protected readonly Model = NpmsDashboardStatusModel as ModelCtor<NpmsDashboardStatusModel>;
}