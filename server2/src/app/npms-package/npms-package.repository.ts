
import { ModelCtor } from "sequelize";
import { BaseRepository } from "../../common/classes/repository.base";
import { NpmsPackageModel } from "./npms-package.model";

export class NpmsPackageRepository extends BaseRepository<NpmsPackageModel> {
  protected readonly Model = NpmsPackageModel as ModelCtor<NpmsPackageModel>;
}