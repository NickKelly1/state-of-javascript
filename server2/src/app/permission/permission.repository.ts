import { Model, ModelCtor } from "sequelize";
import { BaseRepository } from "../../common/classes/repository.base";
import { PermissionModel } from "./permission.model";



export class PermissionRepository extends BaseRepository<PermissionModel> {
  protected readonly Model = PermissionModel as ModelCtor<PermissionModel>;
}