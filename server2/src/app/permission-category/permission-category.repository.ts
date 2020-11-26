import { Model, ModelCtor } from "sequelize";
import { PermissionCategoryModel } from "../../circle";
import { BaseRepository } from "../../common/classes/repository.base";



export class PermissionCategoryRepository extends BaseRepository<PermissionCategoryModel> {
  protected readonly Model = PermissionCategoryModel as ModelCtor<PermissionCategoryModel>;
}