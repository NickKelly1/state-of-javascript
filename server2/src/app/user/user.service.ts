import { UserModel } from '../../circle';
import { BadRequestException } from '../../common/exceptions/types/bad-request.exception';
import { auditableRo } from '../../common/helpers/auditable-ro.helper';
import { ist } from '../../common/helpers/is.helper';
import { softDeleteableRo } from '../../common/helpers/soft-deleteable-ro.helper';
import { UserLang } from '../../common/i18n/packs/user.lang';
import { IRequestContext } from '../../common/interfaces/request-context.interface';
import { QueryRunner } from '../db/query-runner';
import { ICreateUserDto } from './dtos/create-user.dto';
import { IUpdateUserDto } from './dtos/update-user.dto';
import { IUserRo } from './dtos/user.ro';
import { UserField } from './user.attributes';

export class UserService {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  async create(arg: {
    runner: QueryRunner;
    dto: ICreateUserDto;
  }): Promise<UserModel> {
    const { dto, runner } = arg;
    const { transaction } = runner;

    const existing = await UserModel.findOne({ where: { [UserField.name]: dto.name }, transaction });
    if (existing) {
      const nameViolation = this.ctx.except(BadRequestException({
        data: { [UserField.name]: [this.ctx.lang(UserLang.AlreadyExists({ name: dto.name }))] }
      }));
      throw nameViolation
    }

    const user = UserModel.build({
      name: dto.name,
    });

    await user.save({ transaction });
    return user;
  }

  async update(arg: {
    runner: QueryRunner;
    model: UserModel;
    dto: IUpdateUserDto;
  }) {
    const { model, dto, runner } = arg;
    const { transaction } = runner;
    if (ist.notUndefined(dto.name)) model.name = dto.name;
    await model.save({ transaction });
    return model;
  }

  async delete(arg: {
    model: UserModel;
    runner: QueryRunner;
    dto: IUpdateUserDto;
  }): Promise<UserModel> {
    const { model, runner, dto } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction });
    return model;
  }

  toRo(arg: {
    model: UserModel,
  }): IUserRo {
    const { model } = arg;
    return {
      id: model.id,
      name: model.name,
      ...auditableRo(model),
      ...softDeleteableRo(model),
    };
  }
}
