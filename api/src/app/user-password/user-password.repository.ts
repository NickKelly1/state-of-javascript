import { Model, ModelCtor } from "sequelize";
import { UserPasswordModel } from "../../circle";
import { BaseRepository } from "../../common/classes/repository.base";



export class UserPasswordRepository extends BaseRepository<UserPasswordModel> {
  protected readonly Model = UserPasswordModel as ModelCtor<UserPasswordModel>;
}