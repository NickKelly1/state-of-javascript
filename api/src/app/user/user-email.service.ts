import { UserModel } from '../../circle';
import { assertDefined } from '../../common/helpers/assert-defined.helper';
import { ist } from '../../common/helpers/ist.helper';
import { logger } from '../../common/logger/logger';
import { QueryRunner } from '../db/query-runner';
import { UserTokenType } from '../user-token-type/user-token-type.const';
import { UserTokenAssociation } from '../user-token/user-token.associations';
import { IUserServiceSendVerifyEmailChangeEmailDto } from './service-dto/user-service.send-verify-email-change-email.dto';
import { TUserTokenVerifyEmailChangeData } from '../user-token/types/user-token.verify-email-change-data.type';
import { unwrap } from '../../common/helpers/unwrap.helper';
import { BaseContext } from '../../common/context/base.context';
import { UserEmailLang } from './user-email.lang'

export class UserEmailService {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
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
    const token_id = await this.ctx.services.userTokenService.create({
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
      .then(token => token.id);

    runner.afterCommit(() => this.ctx.services.universal.db.transact(async ({ runner }) => {
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
      await this.ctx.services.universal.jobService.email.enqueue({
          to: [user.email],
          cc: null,
          subject: this.ctx.lang(UserEmailLang.WelcomeEmailSubject({
            welcomeTo: 'nickkelly.dev',
            name: user.name,
          })),
          text: this.ctx.lang(UserEmailLang.WelcomeEmailBody({
            welcomeTo: 'nickkelly.dev',
            verifyUrl: link,
            name: user.name,
          })),
        });
    }));

    return true;
  }


  /**
   * Send a Verification Email
   *
   * @param arg
   */
  async sendVerificationEmail(arg: {
    model: UserModel;
    runner: QueryRunner;
  }): Promise<boolean> {
    const { model, runner } = arg;

    if (!model.email) return false;

    const redirect_uri = this.ctx.services.universal.env.VERIFY_EMAIL_URI;

    // Create a new UserToken...
    const token_id = await this.ctx.services.userTokenService.create({
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
      .then(token => token.id);

    runner.afterCommit(() => this.ctx.services.universal.db.transact(async ({ runner }) => {
      // queue email
      const token = await this.ctx.services.userTokenRepository.findByPkOrfail(token_id, {
        unscoped: true,
        runner,
        options: { include: [{ association: UserTokenAssociation.user, }], },
      });
      const user = assertDefined(token.user);
      const link = assertDefined(token.redirectUriWithSlug());
      if (ist.nullable(user.email)) {
        logger.warn(`Cannot QueueVerificationEmail to user id: "${user.id}", name: "${user.name}": no email...`);
        return;
      }
      // Queue the Gmail to Send
      await this.ctx.services.universal.jobService.email.enqueue({
          to: [user.email],
          cc: null,
          subject: this.ctx.lang(UserEmailLang.VerificationSubject({
            welcomeTo: 'nickkelly.dev',
            name: user.name,
          })),
          text: this.ctx.lang(UserEmailLang.VerificationBody({
            welcomeTo: 'nickkelly.dev',
            verifyUrl: link,
            name: user.name,
          })),
        });
    }));

    return true;
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
    const token_id = await this.ctx.services.userTokenService.create({
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
    .then(token => token.id);

    runner.afterCommit(() => this.ctx.services.universal.db.transact(async ({ runner }) => {
      // queue email
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
      await this.ctx.services.universal.jobService.email.enqueue({
          to: [user.email],
          cc: null,
          subject: this.ctx.lang(UserEmailLang.RegistrationEmailSubject({
            welcomeTo: 'nickkelly.dev',
            name: user.name,
          })),
          text: this.ctx.lang(UserEmailLang.RegistrationEmailBody({
            welcomeTo: 'nickkelly.dev',
            verifyUrl: link,
            name: user.name,
          })),
        });
    }));

    return true;
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
    const token_id = await this.ctx.services.userTokenService.create({
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
    .then(token => token.id);

    runner.afterCommit(() => this.ctx.services.universal.db.transact(async ({ runner }) => {
      // queue email
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
      await this.ctx.services.universal.jobService.email.enqueue({
          to: [user.email],
          cc: null,
          subject: this.ctx.lang(UserEmailLang.PasswordResetEmailSubject()),
          text: this.ctx.lang(UserEmailLang.PasswordResetEmailBody({
            welcomeTo: 'nickkelly.dev',
            resetUrl: link,
            name: user.name,
          })),
        });
    }));

    return true;
  }


  /**
   * Send a VerifyEmailChangeEmail
   *
   * @param arg
   */
  async sendEmailChangeEmail(arg: {
    model: UserModel;
    runner: QueryRunner;
    dto: IUserServiceSendVerifyEmailChangeEmailDto,
  }): Promise<boolean> {
    const { model, runner, dto } = arg;

    // redirect to the front-end...
    const redirect_uri = this.ctx.services.universal.env.VERIFY_EMAIL_CHANGE_URI;

    const data: TUserTokenVerifyEmailChangeData = {
      email: dto.email,
    }

    // Create a new UserToken...
    const token_id = await this.ctx.services.userTokenService.create({
      runner,
      user: model,
      dto: {
        redirect_uri,
        data,
        // 30 days...
        expires_at: new Date(Date.now() + 1_000 * 60 * 60 * 24 * 30),
        type_id: UserTokenType.VerifyEmailChange,
      },
    })
    .then(token => token.id)

    runner.afterCommit(() => this.ctx.services.universal.db.transact(async ({ runner }) => {
      // queue email
      const token = await this.ctx.services.userTokenRepository.findByPkOrfail(token_id, {
        unscoped: true,
        runner,
        options: { include: [{ association: UserTokenAssociation.user, }], },
      });
      const user = assertDefined(token.user);
      const link = assertDefined(token.redirectUriWithSlug());
      const data = unwrap.right(TUserTokenVerifyEmailChangeData.decode(token.data));

      // Queue the Gmail to Send
      await this.ctx.services.universal.jobService.email.enqueue({
          to: [data.email],
          cc: null,
          subject: this.ctx.lang(UserEmailLang.EmailChangeSubject({
            welcomeTo: 'nickkelly.dev',
            name: user.name,
          })),
          text: this.ctx.lang(UserEmailLang.EmailChangeBody({
            welcomeTo: 'nickkelly.dev',
            verifyUrl: link,
            name: user.name,
          })),
        });
    }));

    return true;
  }
}
