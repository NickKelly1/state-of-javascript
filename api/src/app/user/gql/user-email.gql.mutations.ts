import { GraphQLBoolean, GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { Op } from "sequelize";
import { GqlContext } from "../../../common/context/gql.context";
import { BadRequestException } from "../../../common/exceptions/types/bad-request.exception";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { ist } from "../../../common/helpers/ist.helper";
import { toId } from "../../../common/helpers/to-id.helper";
import { unwrap } from "../../../common/helpers/unwrap.helper";
import { AuthLang } from "../../../common/i18n/packs/auth.lang";
import { UserTokenLang } from "../../../common/i18n/packs/user-token.lang";
import { logger } from "../../../common/logger/logger";
import { AuthenticationGqlNode, IAuthenticationGqlNodeSource } from "../../auth/gql-input/authorisation.gql";
import { RoleAssociation } from "../../role/role.associations";
import { ICreateUserPasswordDto } from "../../user-password/dtos/create-user-password.dto";
import { IUpdateUserPasswordDto } from "../../user-password/dtos/update-user-password.dto";
import { TUserTokenVerifyEmailChangeData } from "../../user-token/types/user-token.verify-email-change-data.type";
import { UserTokenAssociation } from "../../user-token/user-token.associations";
import { ConsumeResetPasswordTokenGqlInput, ConsumeResetPasswordTokenGqlInputValidator } from "../gql-input/consume-reset-forgotten-user-password.gql";
import { ConsumeEmailChangeTokenGqlInput, ConsumeEmailChangeTokenGqlInputValidator } from "../gql-input/consume-email-change-token.gql.input";
import { ConsumeEmailVerificationTokenGqlInput, ConsumeEmailVerificationTokenGqlInputValidator } from "../gql-input/consume-verify-email.gql.input";
import { RequestEmailChangeEmailGqlInput, RequestUserEmailChangeEmailGqlInputValidator } from "../gql-input/request-email-change.email.gql";
import { RequestPasswordResetEmailGqlInput, RequestPasswordResetGqlInputValidator } from "../gql-input/request-password-reset.email.gql";
import { RequestWelcomeEmailGqlInput, RequestWelcomeEmailGqlInputValidator } from "../gql-input/request-user-welcome.email.gql";
import { RequestVerificationEmailGqlInput, RequestVerificationEmailGqlInputValidator } from "../gql-input/request-verification.email.gql";
import { ConsumeWelcomeTokenGqlInput, ConsumeWelcomeTokenGqlInputValidator } from "../gql-input/welcome-user.gql";
import { IUserServiceSendVerifyEmailChangeEmailDto } from "../service-dto/user-service.send-verify-email-change-email.dto";
import { IUserServiceUpdateUserDto } from "../service-dto/user-service.update-user.dto";
import { UserAssociation } from "../user.associations";
import { UserField } from "../user.attributes";
import { UserLang } from "../user.lang";
import { UserEmailLang } from "../user-email.lang";

export const UserEmailGqlMutations: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  /**
   * Request a PasswordResetEmail to be sent
   */
  requestPasswordResetEmail: {
    type: GraphQLNonNull(GraphQLBoolean),
    args: { dto: { type: GraphQLNonNull(RequestPasswordResetEmailGqlInput), }, },
    resolve: async (parent, args, ctx): Promise<true> => {
      const dto = ctx.validate(RequestPasswordResetGqlInputValidator, args.dto);
      await ctx.services.universal.db.transact(async ({ runner }) => {
        const user = await ctx.services.userRepository.findOne({
          runner,
          options: { where: { [UserField.email]: { [Op.eq]: dto.email, }, }, },
        });
        if (!user) return false;
        if (!ctx.services.userEmailPolicy.canRequestPasswordResetEmail({ model: user })) {
          logger.warn(`Failed to reset password for user id: "${user.id}", email: "${user.email}", name: "${user.name}"`);
          return false;
        }
        await ctx.services.userEmailService.sendPasswordResetEmail({ model: user, runner });
      });
      return true;
    },
  },


  /**
   * Consume ForgottenUserPasswordReset token
   */
  consumePasswordResetToken: {
    type: GraphQLNonNull(AuthenticationGqlNode),
    args: { dto: { type: GraphQLNonNull(ConsumeResetPasswordTokenGqlInput), }, },
    resolve: async (parent, args, ctx): Promise<IAuthenticationGqlNodeSource> => {
      const dto = ctx.validate(ConsumeResetPasswordTokenGqlInputValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }): Promise<IAuthenticationGqlNodeSource> => {
        const token = await ctx.services.userTokenRepository.findOneBySlugOrFail(dto.token, {
          runner,
          options: { include: [{
            association: UserTokenAssociation.user,
            include: [
              { association: UserAssociation.password, },
              {
                association: UserAssociation.roles,
                include: [ { association: RoleAssociation.permissions, }, ],
              },
            ],
          },],},
        });
        // correct token type?
        if (!token.isForgottenPasswordReset()) {
          const message = ctx.lang(AuthLang.BadTokenType);
          throw new BadRequestException(message);
        }

        // expired?
        if (token.isExpired()) {
          const message = ctx.lang(UserTokenLang.TokenExpired);
          throw new BadRequestException(message);
        }

        const user = assertDefined(token.user);
        const oldPassword = user.password;

        // change password
        if (ist.nullable(oldPassword)) {
          // create a password
          const userPasswordServiceDto: ICreateUserPasswordDto = { password: dto.password };
          await ctx.services.userPasswordService.create({ runner, user, dto: userPasswordServiceDto, });
        }
        else {
          // update password
          const userPasswordServiceDto: IUpdateUserPasswordDto = { password: dto.password, };
          await ctx.services.userPasswordService.update({ model: oldPassword, runner, dto: userPasswordServiceDto, });
        }

        const userPermissions = assertDefined(user.roles).flatMap(role => assertDefined(role.permissions));
        const systemPermissions = await ctx.services.universal.systemPermissionsService.getPermissions()
        const auth = await ctx.services.authService.authenticate({
          res: ctx.http?.res,
          user,
          permissions: userPermissions.map(toId)
            .concat(...systemPermissions.authenticated.map(toId))
            .concat(...systemPermissions .pub .map(toId)),
        })

        // delete the token so it can't be re-used
        await ctx.services.userTokenService.softDelete({ model: token, runner });

        return ctx.services.authService.toAuthenticationGqlNodeSource({ user, auth });
      });

      return final;
    },
  },


  /**
   * Send a Welcome Email to a User that's been created for someone else, prompting them to set a name and password
   */
  requestWelcomeEmail: {
    type: GraphQLNonNull(GraphQLBoolean),
    args: { dto: { type: GraphQLNonNull(RequestWelcomeEmailGqlInput), }, },
    resolve: async (parent, args, ctx): Promise<boolean> => {
      // validate
      const dto = ctx.validate(RequestWelcomeEmailGqlInputValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const user = await ctx.services.userRepository.findByPkOrfail(dto.user_id, { runner });
        // authorise request
        ctx.authorize(
          ctx.services.userEmailPolicy.canRequestWelcomeEmail({ model: user }),
          UserLang.CannotRequestWelcomeEmail({ model: user })
        );
        // do request
        const result = await ctx.services.userEmailService.sendWelcomeEmail({ model: user, runner });
        return result;
      });
      return final;
    },
  },


  /**
   * Consume a WelcomeEmail to a User that's been created for someone else, prompting them to set a name and password
   * 
   * TODO: return jwt & check cookies are being set...
   */
  consumeWelcomeToken: {
    type: GraphQLNonNull(AuthenticationGqlNode),
    args: { dto: { type: GraphQLNonNull(ConsumeWelcomeTokenGqlInput), }, },
    resolve: async (parent, args, ctx): Promise<IAuthenticationGqlNodeSource> => {
      const dto = ctx.validate(ConsumeWelcomeTokenGqlInputValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }): Promise<IAuthenticationGqlNodeSource> => {
        // find token
        const token = await ctx.services.userTokenRepository.findOneBySlugOrFail(dto.token, {
          runner,
          options: {
            include: [{
              association: UserTokenAssociation.user,
              include: [
                { association: UserAssociation.password, },
                {
                  association: UserAssociation.roles,
                  include: [
                    { association: RoleAssociation.permissions, },
                  ],
                },
              ],
            }],
          },
        });
        const user = assertDefined(token.user);

        // correct token type?
        if (!token.isWelcome()) {
          const message = ctx.lang(AuthLang.BadTokenType);
          throw new BadRequestException(message);
        }

        // expired?
        if (token.isExpired()) {
          const message = ctx.lang(UserTokenLang.TokenExpired);
          throw new BadRequestException(message);
        }

        // authorize consume
        ctx.authorize(
          ctx.services.userEmailPolicy.canConsumeWelcomeToken({ model: user }),
          UserEmailLang.CannotConsumeWelcomeToken,
        );

        // do update user
        const userServiceDto: IUserServiceUpdateUserDto = {
          deactivated: false,
          email: undefined,
          name: undefined,
          // mark as verified
          verified: true,
        };
        await ctx.services.userService.update({ runner, dto: userServiceDto, model: user, });

        // change password
        const oldPassword = user.password;
        if (ist.nullable(oldPassword)) {
          // create a password
          const userPasswordServiceDto: ICreateUserPasswordDto = { password: dto.password };
          await ctx.services.userPasswordService.create({ runner, user, dto: userPasswordServiceDto, });
        }
        else {
          // update password
          const userPasswordServiceDto: IUpdateUserPasswordDto = { password: dto.password, };
          await ctx.services.userPasswordService.update({ model: oldPassword, runner, dto: userPasswordServiceDto, });
        }

        const userPermissions = assertDefined(user.roles).flatMap(role => assertDefined(role.permissions));
        const systemPermissions = await ctx.services.universal.systemPermissionsService.getPermissions()

        // authenticate request
        const auth = await ctx.services.authService.authenticate({
          res: ctx.http?.res,
          user,
          permissions: userPermissions.map(toId)
            .concat(...systemPermissions.authenticated.map(toId))
            .concat(...systemPermissions.pub.map(toId)),
        })

        // delete the token so it can't be re-used
        await ctx.services.userTokenService.softDelete({ model: token, runner });

        return ctx.services.authService.toAuthenticationGqlNodeSource({ user, auth });
      });

      return final;
    },
  },


  /**
   * Request a VerificationEmail be sent to the user
   */
  requestVerificationEmail: {
    type: GraphQLNonNull(GraphQLBoolean),
    args: { dto: { type: GraphQLNonNull(RequestVerificationEmailGqlInput), }, },
    resolve: async (parent, args, ctx): Promise<boolean> => {
      // validate
      const dto = ctx.validate(RequestVerificationEmailGqlInputValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const user = await ctx.services.userRepository.findByPkOrfail(dto.user_id, { runner });
        // authorise request
        ctx.authorize(
          ctx.services.userEmailPolicy.canRequestVerificationEmail({ model: user }),
          UserEmailLang.CannotRequestVerificationEmail,
        );
        // send email
        const result = await ctx.services.userEmailService.sendVerificationEmail({ model: user, runner });
        return result;
      });
      return final;
    },
  },


  /**
   * Consume an EmailVerification Token & thereby Verify the Users email
   */
  consumeVerificationToken: {
    type: GraphQLNonNull(AuthenticationGqlNode),
    args: { dto: { type: GraphQLNonNull(ConsumeEmailVerificationTokenGqlInput) }, },
    resolve: async (parent, args, ctx): Promise<IAuthenticationGqlNodeSource> => {
      const dto = ctx.validate(ConsumeEmailVerificationTokenGqlInputValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }): Promise<IAuthenticationGqlNodeSource> => {
        const token = await ctx.services.userTokenRepository.findOneBySlugOrFail(dto.token, {
          runner,
          options: {
            include: [{
              association: UserTokenAssociation.user,
              include: [
                { association: UserAssociation.password, },
                {
                  association: UserAssociation.roles,
                  include: [
                    { association: RoleAssociation.permissions, },
                  ],
                },
              ],
            }],
          },
        });
        const user = assertDefined(token.user);

        // correct token type?
        if (!token.isVerifyEmail()) {
          const message = ctx.lang(AuthLang.BadTokenType);
          throw new BadRequestException(message);
        }

        // expired?
        if (token.isExpired()) {
          const message = ctx.lang(UserTokenLang.TokenExpired);
          throw new BadRequestException(message);
        }

        // authorize
        ctx.authorize(
          ctx.services.userEmailPolicy.canConsumeVerificationToken({ model: user }),
          UserEmailLang.CannotConsumeVerificationToken,
        );

        // update user
        const userServiceDto: IUserServiceUpdateUserDto = {
          // mark as verified
          verified: true,
        };

        await ctx.services.userService.update({ runner, dto: userServiceDto, model: user, });

        const userPermissions = assertDefined(user.roles).flatMap(role => assertDefined(role.permissions));
        const systemPermissions = await ctx.services.universal.systemPermissionsService.getPermissions()

        const auth = await ctx.services.authService.authenticate({
          res: ctx.http?.res,
          user,
          permissions: userPermissions.map(toId)
            .concat(...systemPermissions.authenticated.map(toId))
            .concat(...systemPermissions.pub.map(toId)),
        })

        // delete the token so it can't be re-used
        await ctx.services.userTokenService.softDelete({ model: token, runner });

        return ctx.services.authService.toAuthenticationGqlNodeSource({ user, auth });
      });

      return final;
    }
  },


  /**
   * Send an Email change request to a User's new desired email
   */
  requestEmailChangeEmail: {
    type: GraphQLNonNull(GraphQLBoolean),
    args: { dto: { type: GraphQLNonNull(RequestEmailChangeEmailGqlInput), }, },
    resolve: async (parent, args, ctx): Promise<boolean> => {
      // validate
      const dto = ctx.validate(RequestUserEmailChangeEmailGqlInputValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const user = await ctx.services.userRepository.findByPkOrfail(dto.user_id, { runner });
        // verify the email isn't taken
        const exists = await ctx.services.userRepository.findOne({
          runner,
          unscoped: true,
          options: {
            paranoid: true,
            where: { [UserField.email]: { [Op.eq]: dto.email, }, },
          },
        });
        if (ist.defined(exists)) {
          const message = ctx.lang(UserLang.EmailTaken({ email: dto.email }));
          throw new BadRequestException(message, { email: [message] });
        }
        // authorise request
        ctx.authorize(
          ctx.services.userEmailPolicy.canRequestEmailChangeEmail({ model: user }),
          UserEmailLang.CannotRequestEmailChangeEmail,
        );
        const serviceDto: IUserServiceSendVerifyEmailChangeEmailDto = {
          email: dto.email,
        }
        // send email
        const result = await ctx.services.userEmailService.sendEmailChangeEmail({
          model: user,
          runner,
          dto: serviceDto,
        });
        return result;
      });
      return final;
    },
  },


  /**
   * Consume EmailChangeToken
   */
  consumeEmailChangeToken: {
    type: GraphQLNonNull(AuthenticationGqlNode),
    args: { dto: { type: GraphQLNonNull(ConsumeEmailChangeTokenGqlInput) }, },
    resolve: async (parent, args, ctx): Promise<IAuthenticationGqlNodeSource> => {
      const dto = ctx.validate(ConsumeEmailChangeTokenGqlInputValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }): Promise<IAuthenticationGqlNodeSource> => {
        const token = await ctx.services.userTokenRepository.findOneBySlugOrFail(dto.token, {
          runner,
          options: {
            include: [{
              association: UserTokenAssociation.user,
              include: [
                { association: UserAssociation.password, },
                {
                  association: UserAssociation.roles,
                  include: [
                    { association: RoleAssociation.permissions, },
                  ],
                },
              ],
            }],
          },
        });
        const user = assertDefined(token.user);

        // correct token type?
        if (!token.isVerifyEmailChange()) {
          const message = ctx.lang(AuthLang.BadTokenType);
          throw new BadRequestException(message);
        }

        // expired?
        if (token.isExpired()) {
          const message = ctx.lang(UserTokenLang.TokenExpired);
          throw new BadRequestException(message);
        }

        // authorize
        ctx.authorize(
          ctx.services.userEmailPolicy.canConsumeEmailChangeToken({ model: user }),
          UserEmailLang.CannotConsumeEmailChangeVerificationToken,
        );

        const data = unwrap.right(TUserTokenVerifyEmailChangeData.decode(token.data));

        // update user
        const userServiceDto: IUserServiceUpdateUserDto = {
          // mark as verified
          verified: true,
          email: data.email,
        };

        await ctx.services.userService.update({ runner, dto: userServiceDto, model: user, });

        const userPermissions = assertDefined(user.roles).flatMap(role => assertDefined(role.permissions));
        const systemPermissions = await ctx.services.universal.systemPermissionsService.getPermissions();

        const auth = await ctx.services.authService.authenticate({
          res: ctx.http?.res,
          user,
          permissions: userPermissions.map(toId)
            .concat(...systemPermissions.authenticated.map(toId))
            .concat(...systemPermissions.pub.map(toId)),
        });

        // delete the token so it can't be re-used
        await ctx.services.userTokenService.softDelete({ model: token, runner });

        return ctx.services.authService.toAuthenticationGqlNodeSource({ user, auth });
      });

      return final;
    }
  },
});
