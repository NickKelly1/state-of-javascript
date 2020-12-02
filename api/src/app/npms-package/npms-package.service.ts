import { Op } from 'sequelize';
import { BadRequestException } from '../../common/exceptions/types/bad-request.exception';
import { ist } from '../../common/helpers/ist.helper';
import { toMapBy } from '../../common/helpers/to-id-map.helper';
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

  /**
   * Check that data won't violate db constraints
   *
   * @param arg
   */
  async checkConstraints(arg: {
    runner: QueryRunner;
    dataKey?: string;
    dtos: { names: string[]; }[];
  }): Promise<void> {
    const { dtos, runner, dataKey } = arg;
    const { transaction } = runner;
    const names = Array.from(new Set(dtos.flatMap(dto => dto.names)));
    const existing = await NpmsPackageModel.findAll({ where: { [NpmsPackageField.name]: { [Op.in]: names} }, transaction });
    if (existing.length) {
      const message = this.ctx.lang(NpmsLang.AlreadyExists({ names: existing.map(ex => ex.name) }));
      const nameViolation = this.ctx.except(BadRequestException({
        message,
        data: ist.notUndefined(dataKey) ? { [NpmsPackageField.name]: [message] } : undefined,
      }));
      throw nameViolation;
    }
  }


  /**
   * Create a model
   *
   * @param arg
   */
  async create(arg: {
    runner: QueryRunner;
    dto: { names: string[] };
  }): Promise<NpmsPackageModel[]> {
    const { dto, runner } = arg;
    const { transaction } = runner;
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


  /**
   * Update many models
   *
   * @param arg
   */
  async synchronise(arg: {
    runner: QueryRunner;
    since: Date;
  }): Promise<NpmsPackageModel[]> {
    const { runner, since } = arg;
    const { transaction } = runner;

    logger.info(`Checking for stale npms packages not updated since ${since.toISOString()}...`);

    const staleNpmsPackages = await this.ctx.services.npmsPackageRepository.findAll({
      runner,
      options: {
        where: { [NpmsPackageField.last_ran_at]: { [Op.lte]: since }, },
        limit: 5,
      },
    });
    if (staleNpmsPackages.length <= 0) {
      logger.info('All npms packages are up to date')
      return [];
    }

    const names = staleNpmsPackages.map(pkg => pkg.name);
    logger.info(`Found ${staleNpmsPackages.length} npms packages out of date: ${names.join(', ')}`);
    const results = await this.ctx.services.universal.npmsApi.packageInfos({ names, });
    const resultsMap = new Map(Object.entries(results));
    const now = new Date();
    const savedPackages = await Promise
      .all(staleNpmsPackages
        .map(async stale => {
          const data = resultsMap.get(stale.name);
          if (!data) {
            logger.warn(`Unable to update npms package: "${stale.name}". No data found.`);
            return undefined;
          }
          logger.info(`Saving udpated npms package: "${stale.name}".`);
          stale.data = data;
          stale.last_ran_at = now;
          await stale.save({ transaction });
          return stale;
        })
      )
      .then(pkgs => pkgs.filter(ist.defined));

    return savedPackages;
  }


  /**
   * Delete a model
   *
   * @param arg
   */
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
