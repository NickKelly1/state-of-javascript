import { Model, ModelCtor } from "sequelize/types";
import { BaseRepository } from "../../common/classes/repository.base";
import { UserPasswordModel } from "../user-password/user-password.model";
import { UserModel } from "./user.model";



export class UserRepository extends BaseRepository<UserModel> {
  protected readonly Model = UserModel as ModelCtor<UserModel>;
}