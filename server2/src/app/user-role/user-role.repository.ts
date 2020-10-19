import { Model, ModelCtor } from "sequelize/types";
import { BaseRepository } from "../../common/classes/repository.base";
import { UserRoleModel } from "./user-role.model";



export class UserRoleRepository extends BaseRepository<UserRoleModel> {
  protected readonly Model = UserRoleModel as ModelCtor<UserRoleModel>;
}