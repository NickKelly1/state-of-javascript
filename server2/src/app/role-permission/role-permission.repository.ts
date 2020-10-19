import { Model, ModelCtor } from "sequelize/types";
import { BaseRepository } from "../../common/classes/repository.base";
import { UserPasswordModel } from "../user-password/user-password.model";
import { RolePermissionModel } from "./role-permission.model";



export class RolePermissionRepository extends BaseRepository<RolePermissionModel> {
  protected readonly Model = RolePermissionModel as ModelCtor<RolePermissionModel>;
}