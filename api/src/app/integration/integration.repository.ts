import { Model, ModelCtor } from "sequelize";
import { BaseRepository } from "../../common/classes/repository.base";
import { IntegrationModel } from "./integration.model";



export class IntegrationRepository extends BaseRepository<IntegrationModel> {
  protected readonly Model = IntegrationModel as ModelCtor<IntegrationModel>;
}