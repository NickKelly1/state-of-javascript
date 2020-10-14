import { PermissionModel } from '../../circle';
import { BadRequestException } from '../../common/exceptions/types/bad-request.exception';
import { auditableRo } from '../../common/helpers/auditable-ro.helper';
import { is } from '../../common/helpers/is.helper';
import { softDeleteableRo } from '../../common/helpers/soft-deleteable-ro.helper';
import { PermissionLang } from '../../common/i18n/packs/permission.lang';
import { IRequestContext } from '../../common/interfaces/request-context.interface';
import { QueryRunner } from '../db/query-runner';
import { ICreatePermissionDto } from './dtos/create-permission.dto';
import { IUpdatePermissionDto } from './dtos/update-permission.dto';
import { IPermissionRo } from './dtos/permission.ro';
import { PermissionField } from './permission.attributes';

export class PermissionService {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  async create(arg: {
    runner: QueryRunner;
    dto: ICreatePermissionDto;
  }): Promise<PermissionModel> {
    const { dto, runner } = arg;
    const { transaction } = runner;

    const existing = await PermissionModel.findOne({ where: { [PermissionField.name]: dto.name }, transaction });
    if (existing) {
      const nameViolation = this.ctx.except(BadRequestException({
        data: { [PermissionField.name]: [this.ctx.lang(PermissionLang.AlreadyExists({ name: dto.name }))] }
      }));
      throw nameViolation
    }

    const permission = PermissionModel.build({
      name: dto.name,
    });

    await permission.save({ transaction });
    return permission;
  }

  async update(arg: {
    runner: QueryRunner;
    model: PermissionModel;
    dto: IUpdatePermissionDto;
  }) {
    const { model, dto, runner } = arg;
    const { transaction } = runner;
    if (is.notUndefined(dto.name)) model.name = dto.name;
    await model.save({ transaction });
    return model;
  }

  async delete(arg: {
    model: PermissionModel;
    runner: QueryRunner;
    dto: IUpdatePermissionDto;
  }): Promise<PermissionModel> {
    const { model, runner, dto } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction });
    return model;
  }

  toRo(arg: {
    model: PermissionModel,
  }): IPermissionRo {
    const { model } = arg;
    return {
      id: model.id,
      name: model.name,
      ...auditableRo(model),
      ...softDeleteableRo(model),
    };
  }
}
