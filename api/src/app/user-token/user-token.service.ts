import { UserModel, } from '../../circle';
import { ist } from '../../common/helpers/ist.helper';
import { QueryRunner } from '../db/query-runner';
import { IUserTokenServiceCreateUserTokenDto } from './dtos/user-token-service.create-user-token.dto';
import { IUserTokenServiceUpdateUserTokenDto } from './dtos/user-token-service.update-user-token.dto';
import { UserTokenModel } from './user-token.model';
import cryptoRandomString from 'crypto-random-string';
import { BaseContext } from '../../common/context/base.context';

export class UserTokenService {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }


  /**
   * Create a UserLink
   *
   * @param arg
   */
  async create(arg: {
    runner: QueryRunner;
    user: UserModel;
    dto: IUserTokenServiceCreateUserTokenDto;
  }): Promise<UserTokenModel> {
    const { dto, runner, user } = arg;
    const { transaction } = runner;

    const model = UserTokenModel.build({
      expires_at: dto.expires_at,
      type_id: dto.type_id,
      user_id: user.id,
      slug: cryptoRandomString({ length: 30, type: 'url-safe', }),
      redirect_uri: dto.redirect_uri,
      data: dto.data,
    });
    await model.save({ transaction });

    return model;
  }


  /**
   * Update a UserLink
   *
   * @param arg
   */
  async update(arg: {
    runner: QueryRunner;
    model: UserTokenModel;
    dto: IUserTokenServiceUpdateUserTokenDto;
  }): Promise<UserTokenModel> {
    const { model, dto, runner } = arg;
    const { transaction } = runner;
    if (ist.notUndefined(dto.data)) { model.data = dto.data; }
    if (ist.notUndefined(dto.expires_at)) { model.expires_at = dto.expires_at; }
    if (ist.notUndefined(dto.redirect_uri)) { model.redirect_uri = dto.redirect_uri; }
    await model.save({ transaction });
    return model;
  }


  /**
   * SoftDelete a UserLink
   *
   * @param arg
   */
  async softDelete(arg: {
    model: UserTokenModel;
    runner: QueryRunner;
  }): Promise<UserTokenModel> {
    const { model, runner } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction });
    return model;
  }


  /**
   * HardDelete a UserLink
   *
   * @param arg
   */
  async hardDelete(arg: {
    model: UserTokenModel;
    runner: QueryRunner;
  }): Promise<UserTokenModel> {
    const { model, runner } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction, force: true });
    return model;
  }
}
