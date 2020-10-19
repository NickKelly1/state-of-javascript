import { RoleModel } from '../../circle';
import { BadRequestException } from '../../common/exceptions/types/bad-request.exception';
import { auditableRo } from '../../common/helpers/auditable-ro.helper';
import { ist } from '../../common/helpers/is.helper';
import { softDeleteableRo } from '../../common/helpers/soft-deleteable-ro.helper';
import { RoleLang } from '../../common/i18n/packs/role.lang';
import { IRequestContext } from '../../common/interfaces/request-context.interface';
import { QueryRunner } from '../db/query-runner';
import { ICreateRoleDto } from './dtos/create-role.dto';
import { IUpdateRoleDto } from './dtos/update-role.dto';
import { IRoleRo } from './dtos/role.ro';
import { RoleField } from './role.attributes';

export class RoleService {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  async create(arg: {
    runner: QueryRunner;
    dto: ICreateRoleDto;
  }): Promise<RoleModel> {
    const { dto, runner } = arg;
    const { transaction } = runner;

    const existing = await RoleModel.findOne({ where: { [RoleField.name]: dto.name }, transaction });
    if (existing) {
      const nameViolation = this.ctx.except(BadRequestException({
        data: { [RoleField.name]: [this.ctx.lang(RoleLang.AlreadyExists({ name: dto.name }))] }
      }));
      throw nameViolation
    }

    const role = RoleModel.build({
      name: dto.name,
    });

    await role.save({ transaction });
    return role;
  }

  async update(arg: {
    runner: QueryRunner;
    model: RoleModel;
    dto: IUpdateRoleDto;
  }) {
    const { model, dto, runner } = arg;
    const { transaction } = runner;
    if (ist.notUndefined(dto.name)) model.name = dto.name;
    await model.save({ transaction });
    return model;
  }

  async delete(arg: {
    model: RoleModel;
    runner: QueryRunner;
    dto: IUpdateRoleDto;
  }): Promise<RoleModel> {
    const { model, runner, dto } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction });
    return model;
  }

  toRo(arg: {
    model: RoleModel,
  }): IRoleRo {
    const { model } = arg;
    return {
      id: model.id,
      name: model.name,
      ...auditableRo(model),
      ...softDeleteableRo(model),
    };
  }
}
