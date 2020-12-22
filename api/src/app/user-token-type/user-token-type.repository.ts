import { Model, ModelCtor } from "sequelize";
import { BaseRepository } from "../../common/classes/base.repository";
import { UserPasswordModel } from "../user-password/user-password.model";
import { UserTokenTypeModel } from "./user-token-type.model";


export class UserTokenTypeRepository extends BaseRepository<UserTokenTypeModel> {
  protected readonly Model = UserTokenTypeModel as ModelCtor<UserTokenTypeModel>;
}