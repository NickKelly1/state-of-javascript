import { UserModel } from '../../circle';
import { BadRequestException } from '../../common/exceptions/types/bad-request.exception';
import { assertDefined } from '../../common/helpers/assert-defined.helper';
import { Combinator } from '../../common/helpers/combinator.helper';
import { ist } from '../../common/helpers/ist.helper';
import { UserLang } from '../../common/i18n/packs/user.lang';
import { IRequestContext } from '../../common/interfaces/request-context.interface';
import { logger } from '../../common/logger/logger';
import { QueryRunner } from '../db/query-runner';
import { RoleModel } from '../role/role.model';
import { UserTokenType } from '../user-token-type/user-token-type.const';
import { UserTokenAssociation } from '../user-token/user-token.associations';
import { UserTokenId } from '../user-token/user-token.id.type';
import { UserRoleModel } from '../user-role/user-role.model';
import { IUserServiceCreateUserDto } from './service-dto/user-service.create-user.dto';
import { IUserServiceUpdateUserDto } from './service-dto/user-service.update-user.dto';
import { UserField } from './user.attributes';

export class UserService {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  /**
   * Find unexpected or missing UserRoles & Roles
   *
   * @param arg
   */
  diffUserRoles(arg: {
    current: UserRoleModel[];
    desired: RoleModel[];
  }): {
    missing: RoleModel[];
    unexpected: UserRoleModel[];
    normal: UserRoleModel[];
  } {
    const { current, desired } = arg;
    const combinator = new Combinator({
      // a => previous
      a: new Map(current.map(userRole => [userRole.role_id, userRole])),
      // b => next
      b: new Map(desired.map(role => [role.id, role])),
    });
    // in previous but not next
    const unexpected = Array.from(combinator.diff.aNotB.values());
    // in next but not previous
    const missing = Array.from(combinator.diff.bNotA.values());
    // normal role-permissions
    const normal = Array.from(combinator.bJoinA.a.values());

    return {
      unexpected,
      missing,
      normal,
    };
  }


  /**
   * Create a user
   *
   * @param arg
   */
  async create(arg: {
    runner: QueryRunner;
    dto: IUserServiceCreateUserDto;
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
      email: dto.email,
      verified: dto.verified,
      deactivated: dto.deactivated,
    });

    await user.save({ transaction });
    return user;
  }


  /**
   * Update a user
   *
   * @param arg
   */
  async update(arg: {
    runner: QueryRunner;
    model: UserModel;
    dto: IUserServiceUpdateUserDto;
  }): Promise<UserModel> {
    const { model, dto, runner } = arg;
    const { transaction } = runner;
    if (ist.notUndefined(dto.name)) model.name = dto.name;
    if (ist.notUndefined(dto.email)) model.email = dto.email;
    if (ist.notUndefined(dto.verified)) model.verified = dto.verified;
    if (ist.notUndefined(dto.deactivated)) model.deactivated = dto.deactivated;
    await model.save({ transaction });
    return model;
  }


  /**
   * Delete a user
   *
   * @param arg
   */
  async delete(arg: {
    model: UserModel;
    runner: QueryRunner;
  }): Promise<UserModel> {
    const { model, runner, } = arg;
    const { transaction } = runner;
    await model.destroy({ transaction });
    return model;
  }


  /**
   * Send a WelcomeEmail
   *
   * @param arg
   */
  async sendWelcomeEmail(arg: {
    model: UserModel;
    runner: QueryRunner;
  }): Promise<boolean> {
    const { model, runner } = arg;

    if (!model.email) return false;

    // redirect to the front-end...
    const redirect_uri = this.ctx.services.universal.env.WELCOME_URI;

    // Create a new UserToken...
    const token = await this
      .ctx
      .services
      .userTokenService
      .create({
        runner,
        user: model,
        dto: {
          redirect_uri,
          data: null,
          // 30 days...
          expires_at: new Date(Date.now() + 1_000 * 60 * 60 * 24 * 30),
          type_id: UserTokenType.AcceptWelcome,
        },
      })

    runner.afterCommit(() => this._queueWelcomeEmail({ token_id: token.id }));

    return true;
  }


  /**
   * Fired after sendWelcomeEmail is committed
   *
   * @param arg
   */
  protected async _queueWelcomeEmail(arg: { token_id: UserTokenId }): Promise<void> {
    const { token_id } = arg;

    await this.ctx.services.universal.db.transact(async ({ runner }) => {
      const token = await this.ctx.services.userTokenRepository.findByPkOrfail(token_id, {
        unscoped: true,
        runner,
        options: { include: [{ association: UserTokenAssociation.user, }], },
      });
      const user = assertDefined(token.user);
      const link = assertDefined(token.redirectUriWithSlug());

      if (ist.nullable(user.email)) {
        logger.warn(`Cannot QueueWelcomeEmail to user id: "${user.id}", name: "${user.name}": no email...`);
        return;
      }

      // Queue the Gmail to Send
      await this
        .ctx
        .services
        .universal
        .gmailQueue
        .add({
          to: [user.email],
          cc: null,
          subject: this.ctx.lang(UserLang.WelcomeEmailSubject({
            welcomeTo: 'nickkelly.dev',
            name: user.name,
          })),
          body: this.ctx.lang(UserLang.WelcomeEmailBody({
            welcomeTo: 'nickkelly.dev',
            verifyUrl: link,
            name: user.name,
          })),
        });
    });
  }


  /**
   * Send a Registration Email
   *
   * @param arg
   */
  async sendRegistrationEmail(arg: {
    model: UserModel;
    runner: QueryRunner;
  }): Promise<boolean> {
    const { model, runner } = arg;

    if (!model.email) return false;

    const redirect_uri = this.ctx.services.universal.env.VERIFY_EMAIL_URI;

    // Create a new UserToken...
    const token = await this
      .ctx
      .services
      .userTokenService
      .create({
        runner,
        user: model,
        dto: {
          data: null,
          // 30 days...
          expires_at: new Date(Date.now() + 1_000 * 60 * 60 * 24 * 30),
          redirect_uri,
          type_id: UserTokenType.VerifyEmail,
        },
      })

    runner.afterCommit(() => this._queueRegistrationEmail({ token_id: token.id }));

    return true;
  }


  /**
   * Fired after sendRegistrationEmail is committed
   *
   * @param arg
   */
  protected async _queueRegistrationEmail(arg: { token_id: UserTokenId }): Promise<void> {
    const { token_id } = arg;

    await this.ctx.services.universal.db.transact(async ({ runner }) => {
      const token = await this.ctx.services.userTokenRepository.findByPkOrfail(token_id, {
        unscoped: true,
        runner,
        options: { include: [{ association: UserTokenAssociation.user, }], },
      });
      const user = assertDefined(token.user);
      const link = assertDefined(token.redirectUriWithSlug());
      if (ist.nullable(user.email)) {
        logger.warn(`Cannot QueueRegistrationEmail to user id: "${user.id}", name: "${user.name}": no email...`);
        return;
      }

      // Queue the Gmail to Send
      await this
        .ctx
        .services
        .universal
        .gmailQueue
        .add({
          to: [user.email],
          cc: null,
          subject: this.ctx.lang(UserLang.RegistrationEmailSubject({
            welcomeTo: 'nickkelly.dev',
            name: user.name,
          })),
          body: this.ctx.lang(UserLang.RegistrationEmailBody({
            welcomeTo: 'nickkelly.dev',
            verifyUrl: link,
            name: user.name,
          })),
        });
    });
  }


  /**
   * Send a PasswordResetEmail
   *
   * @param arg
   */
  async sendPasswordResetEmail(arg: {
    model: UserModel;
    runner: QueryRunner;
  }): Promise<boolean> {
    const { model, runner } = arg;

    if (!model.email) return false;

    const redirect_uri = this.ctx.services.universal.env.PASSWORD_RESET_URI;

    // Create a new UserToken...
    const token = await this
      .ctx
      .services
      .userTokenService
      .create({
        runner,
        user: model,
        dto: {
          data: null,
          redirect_uri,
          // 30 days...
          expires_at: new Date(Date.now() + 1_000 * 60 * 60 * 24 * 30),
          type_id: UserTokenType.ForgottenPasswordReset,
        },
      })

    runner.afterCommit(() => this._queuePasswordResetEmail({ token_id: token.id }));

    return true;
  }


  /**
   * Fired when on commit of sendPasswordResetEmail
   */
  protected async _queuePasswordResetEmail(arg: { token_id: UserTokenId }): Promise<void> {
    const { token_id } = arg;

    await this.ctx.services.universal.db.transact(async ({ runner }) => {
      const token = await this.ctx.services.userTokenRepository.findByPkOrfail(token_id, {
        unscoped: true,
        runner,
        options: { include: [{ association: UserTokenAssociation.user, }], },
      });
      const user = assertDefined(token.user);
      const link = assertDefined(token.redirectUriWithSlug());
      if (ist.nullable(user.email)) {
        logger.warn(`Cannot QueuePasswordResetEmail to user id: "${user.id}", name: "${user.name}": no email...`);
        return;
      }

      // Queue the Gmail to Send
      await this
        .ctx
        .services
        .universal
        .gmailQueue
        .add({
          to: [user.email],
          cc: null,
          subject: this.ctx.lang(UserLang.PasswordResetEmailSubject()),
          body: this.ctx.lang(UserLang.PasswordResetEmailBody({
            welcomeTo: 'nickkelly.dev',
            resetUrl: link,
            name: user.name,
          })),
        });
    });
  }
}
