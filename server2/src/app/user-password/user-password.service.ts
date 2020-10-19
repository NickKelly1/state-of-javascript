import { Transaction } from 'sequelize';
import { UserModel, UserPasswordModel } from '../../circle';
import { ist } from '../../common/helpers/is.helper';
import { IRequestContext } from '../../common/interfaces/request-context.interface';
import { QueryRunner } from '../db/query-runner';
import { ICreateUserPasswordDto } from './dtos/create-user-password.dto';
import { IUpdateUserPasswordDto } from './dtos/update-user-password.dto';

export class UserPasswordService {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  async compare(arg: {
    raw: string;
    password: UserPasswordModel;
  }): Promise<boolean> {
    const { raw, password } = arg;

    const comparison = await this.ctx.services.hash().bcryptCompare({
      raw: `${password.salt}${raw}`,
      hash: password.hash,
    })

    return comparison
  }

  protected async encrypt(arg: {
    raw: string,
  }): Promise<{ salt: string, hash: string }> {
    const { raw } = arg;

    const salt = await this.ctx.services.hash().bcryptHash({
      raw: Math.random().toString(),
      rounds: this.ctx.services.env().PSW_SALT_ROUNDS,
    });

    const hash = await this.ctx.services.hash().bcryptHash({
      raw: `${salt}${raw}`,
      rounds: this.ctx.services.env().PSW_SALT_ROUNDS,
    });

    return { hash, salt };
  }

  async create(arg: {
    runner: QueryRunner;
    user: UserModel;
    dto: ICreateUserPasswordDto;
  }): Promise<UserPasswordModel> {
    const { dto, runner, user } = arg;
    const { transaction } = runner;

    const { hash, salt } = await this.ctx.services.userPasswordService().encrypt({ raw: dto.password });
    const password = UserPasswordModel.build({
      hash: hash,
      salt,
      user_id: user.id,
    });
    await password.save({ transaction });

    return password;
  }

  async update(arg: {
    runner: QueryRunner;
    model: UserPasswordModel;
    dto: IUpdateUserPasswordDto;
  }) {
    const { model, dto, runner } = arg;
    const { transaction } = runner;
    if (ist.notUndefined(dto.password)) {
      const { hash, salt } = await this.encrypt({ raw: dto.password });
      model.hash = hash;
      model.salt = salt;
    }
    await model.save({ transaction });
    return model;
  }

  async delete(arg: {
    model: UserPasswordModel;
    runner: QueryRunner;
  }): Promise<UserPasswordModel> {
    const { model, runner } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction });
    return model;
  }
}