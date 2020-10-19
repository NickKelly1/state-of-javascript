import { Model, ModelCtor } from "sequelize/types";
import { BaseRepository } from "../../common/classes/repository.base";
import { RoleModel } from "./role.model";



export class RoleRepository extends BaseRepository<RoleModel> {
  protected readonly Model = RoleModel as ModelCtor<RoleModel>;
}