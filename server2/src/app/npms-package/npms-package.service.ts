import { Op } from 'sequelize';
import { BadRequestException } from '../../common/exceptions/types/bad-request.exception';
import { NpmsLang } from '../../common/i18n/packs/npms.lang';
import { IRequestContext } from '../../common/interfaces/request-context.interface';
import { logger } from '../../common/logger/logger';
import { QueryRunner } from '../db/query-runner';
import { NpmsPackageField } from './npms-package.attributes';
import { NpmsPackageModel } from './npms-package.model';

export class NpmsPackageService {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  async create(arg: {
    runner: QueryRunner;
    dto: { names: string[] };
  }): Promise<NpmsPackageModel[]> {
    const { dto, runner } = arg;
    const { transaction } = runner;
    const existing = await NpmsPackageModel.findAll({ where: { [NpmsPackageField.name]: { [Op.in]: dto.names } }, transaction });
    if (existing.length) {
      const nameViolation = this.ctx.except(BadRequestException({
        data: { [NpmsPackageField.name]: [this.ctx.lang(NpmsLang.AlreadyExists({ names: dto.names }))] }
      }));
      throw nameViolation;
    }
    const now = new Date();
    logger.info(`creating news npms records: "${dto.names.join('", "')}"`);
    const results = await this.ctx.services.universal.npmsApi.packageInfos({ names: dto.names });
    const models = NpmsPackageModel.bulkBuild(Object
      .entries(results)
      .map(([name, data]) => ({
        name: name,
        data: data ?? null,
        last_ran_at: now,
      }))
    );
    // save all models...
    await Promise.all(models.map(model => model.save({ transaction })));
    return models;
  }

  async delete(arg: {
    model: NpmsPackageModel;
    runner: QueryRunner;
  }): Promise<NpmsPackageModel> {
    const { model, runner } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction });
    return model;
  }
}
