import { Transaction } from 'sequelize/types';
import { UserModel } from '../../circle';
import { QueryRunner } from '../../common/classes/query-runner';
import { is } from '../../common/helpers/is.helper';
import { IRequestContext } from '../../common/interfaces/request-context.interface';
import { ICreateUserDto } from './dtos/create-user.dto';
import { IUpdateUserDto } from './dtos/update-user.dto';

export const UserService = {
  async create(arg: {
    ctx: IRequestContext;
    runner: QueryRunner;
    dto: ICreateUserDto;
  }): Promise<UserModel> {
    const { dto, runner } = arg;
    const { transaction } = runner;
    const user = UserModel.build({});
    user.first = dto.first;
    user.last = dto.last;
    await user.save({ transaction });
    return user;
  },

  async update(arg: {
    ctx: IRequestContext;
    runner: QueryRunner;
    model: UserModel;
    dto: IUpdateUserDto;
  }) {
    const { model, dto, runner } = arg;
    const { transaction } = runner;
    if (is.notUndefined(dto.first)) model.first = dto.first;
    if (is.notUndefined(dto.last)) model.last = dto.last;
    await model.save({ transaction });
    return model;
  },

  async delete(arg: {
    ctx: IRequestContext;
    model: UserModel;
    runner: QueryRunner;
    dto: IUpdateUserDto;
  }): Promise<UserModel> {
    const { model, runner, dto } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction });
    return model;
  }
}