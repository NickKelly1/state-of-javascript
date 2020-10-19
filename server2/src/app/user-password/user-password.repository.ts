import { Model, ModelCtor } from "sequelize/types";
import { UserPasswordModel } from "../../circle";
import { BaseRepository } from "../../common/classes/repository.base";



export class UserPasswordRepository extends BaseRepository<UserPasswordModel> {
  protected readonly Model = UserPasswordModel as ModelCtor<UserPasswordModel>;
}