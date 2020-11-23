import { Transaction } from 'sequelize';
import { UserModel, UserPasswordModel } from '../../circle';
import { EnvService } from '../../common/environment/env';
import { ist } from '../../common/helpers/ist.helper';
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


  /**
   * Compare a raw password
   *
   * @param arg
   */
  async compare(arg: {
    raw: string;
    password: UserPasswordModel;
  }): Promise<boolean> {
    const { raw, password } = arg;

    const comparison = await this.ctx.services.universal.encryption.bcryptCompare({
      raw: `${password.salt}${raw}`,
      hash: password.hash,
    })

    return comparison
  }


  /**
   * Encrypt a user password
   *
   * @param arg
   */
  protected async encrypt(arg: {
    raw: string,
  }): Promise<{ salt: string, hash: string }> {
    const { raw } = arg;

    const salt = await this.ctx.services.universal.encryption.bcryptHash({
      raw: Math.random().toString(),
      rounds: this.ctx.services.universal.env.PSW_SALT_ROUNDS,
    });

    const hash = await this.ctx.services.universal.encryption.bcryptHash({
      raw: `${salt}${raw}`,
      rounds: this.ctx.services.universal.env.PSW_SALT_ROUNDS,
    });

    return { hash, salt };
  }


  /**
   * Create a password
   *
   * @param arg
   */
  async create(arg: {
    runner: QueryRunner;
    user: UserModel;
    dto: ICreateUserPasswordDto;
  }): Promise<UserPasswordModel> {
    const { dto, runner, user } = arg;
    const { transaction } = runner;

    const { hash, salt } = await this.ctx.services.userPasswordService.encrypt({ raw: dto.password });
    const password = UserPasswordModel.build({
      hash: hash,
      salt,
      user_id: user.id,
    });
    await password.save({ transaction });

    return password;
  }


  /**
   * Update a password
   *
   * @param arg
   */
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


  /**
   * Delete a password
   *
   * @param arg
   */
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