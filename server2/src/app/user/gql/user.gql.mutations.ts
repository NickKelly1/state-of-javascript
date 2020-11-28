import { GraphQLBoolean, GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { Op } from "sequelize";
import { UserModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { BadRequestException } from "../../../common/exceptions/types/bad-request.exception";
import { ForbiddenException } from "../../../common/exceptions/types/forbidden.exception";
import { NotFoundException } from "../../../common/exceptions/types/not-found.exception";
import { GqlJsonObjectScalar } from "../../../common/gql/gql.json.scalar";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { ist } from "../../../common/helpers/ist.helper";
import { toId } from "../../../common/helpers/to-id.helper";
import { unwrap } from "../../../common/helpers/unwrap.helper";
import { ExceptionLang } from "../../../common/i18n/packs/exception.lang";
import { RoleLang } from "../../../common/i18n/packs/role.lang";
import { UserTokenLang } from "../../../common/i18n/packs/user-token.lang";
import { UserLang } from "../../../common/i18n/packs/user.lang";
import { IJson } from "../../../common/interfaces/json.interface";
import { logger } from "../../../common/logger/logger";
import { AuthenticationGqlNode, IAuthenticationGqlNodeSource, IAuthorisationRo } from "../../auth/gql-input/authorisation.gql";
import { AccessTokenGqlNode, IAccessTokenGqlNodeSource } from "../../auth/gql/access-token.gql.node";
import { QueryRunner } from "../../db/query-runner";
import { RoleAssociation } from "../../role/role.associations";
import { RoleId } from "../../role/role.id.type";
import { RoleModel } from "../../role/role.model";
import { ICreateUserPasswordDto } from "../../user-password/dtos/create-user-password.dto";
import { IUpdateUserPasswordDto } from "../../user-password/dtos/update-user-password.dto";
import { UserRoleModel } from "../../user-role/user-role.model";
import { TUserTokenVerifyEmailChangeData } from "../../user-token/types/user-token.verify-email-change-data.type";
import { UserTokenAssociation } from "../../user-token/user-token.associations";
import { ConsumeResetForgottenUserPasswordGqlInput, ConsumeResetForgottenUserPasswordGqlInputValidator } from "../gql-input/consume-reset-forgotten-user-password.gql";
import { ConsumeVerifyEmailChangeGqlInput, ConsumeVerifyEmailChangeGqlInputValidator } from "../gql-input/consume-verify-email-change.gql.input";
import { ConsumeEmailVerificationGqlInput, ConsumeEmaiLVerificationGqlInputValidator } from "../gql-input/consume-verify-email.gql.input";
import { CreateUserGqlInput, CreateUserValidator } from "../gql-input/create-user.gql";
import { DeleteUserGqlInput, DeleteUserValidator } from "../gql-input/delete-user.gql";
import { RequestUserEmailChangeGqlInput, RequestUserEmailChangeGqlInputValidator } from "../gql-input/request-email-change.gql";
import { RequestResetForgottenUserPasswordGqlInput, RequestResetForgottenUserPasswordGqlInputValidator } from "../gql-input/request-reset-forgotten-user-password.gql";
import { RequestUserWelcomeGqlInput, RequestUserWelcomeGqlInputValidator } from "../gql-input/request-user-welcome.gql";
import { UpdateUserGqlInput, UpdateUserValidator } from "../gql-input/update-user.gql";
import { ConsumeUserWelcomeGqlInput, ConsumeUserWelcomeGqlInputValidator } from "../gql-input/welcome-user.gql";
import { IUserServiceCreateUserDto } from "../service-dto/user-service.create-user.dto";
import { IUserServiceSendVerifyEmailChangeEmailDto } from "../service-dto/user-service.send-verify-email-change-email.dto";
import { IUserServiceUpdateUserDto } from "../service-dto/user-service.update-user.dto";
import { UserAssociation } from "../user.associations";
import { UserField } from "../user.attributes";
import { IUserGqlNodeSource, UserGqlNode } from "./user.gql.node";

export const UserGqlMutations: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({

  /**
   * Create a User
   */
  createUser: {
    type: GraphQLNonNull(UserGqlNode),
    args: { dto: { type: GraphQLNonNull(CreateUserGqlInput), }, },
    resolve: async (parent, args, ctx): Promise<IUserGqlNodeSource> => {
      ctx.authorize(ctx.services.userPolicy.canCreate());
      const dto = ctx.validate(CreateUserValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const serviceDto: IUserServiceCreateUserDto = {
          name: dto.name,
          email: dto.email ?? null,
          verified: false,
          deactivated: false,
        };
        const user = await ctx.services.userService.create({ runner, dto: serviceDto });

        // create password
        if (ist.notNullable(dto.password)) {
          const passwordDto: ICreateUserPasswordDto = { password: dto.password };
          await ctx.services.userPasswordService.create({ runner, user, dto: passwordDto });
        }

        // link roles
        if (dto.role_ids?.length) {
          await authorizeAndSyncrhoniseUserRoles({
            ctx,
            currentUserRoles: [],
            role_ids: dto.role_ids,
            runner,
            user,
          });
        }
        return user;
      });
      return final;
    },
  },


  /**
   * Update a User
   */
  updateUser: {
    type: GraphQLNonNull(UserGqlNode),
    args: { dto: { type: GraphQLNonNull(UpdateUserGqlInput), }, },
    resolve: async (parent, args, ctx): Promise<IUserGqlNodeSource> => {
      const dto = ctx.validate(UpdateUserValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const user = await ctx.services.userRepository.findByPkOrfail(dto.id, {
          runner,
          options: { include: [
            { association: UserAssociation.userRoles },
            { association: UserAssociation.password },
          ] },
        });
        ctx.authorize(ctx.services.userPolicy.canUpdate({ model: user }));
        const serviceDto: IUserServiceUpdateUserDto = {
          name: dto.name ?? undefined,
          email: dto.email,
          verified: undefined,
          deactivated: undefined,
        };

        // deactivate?
        if (ist.notNullable(dto.deactivated)) {
          ctx.authorize(ctx.services.userPolicy.canDeactivate({ model: user }));
          serviceDto.deactivated = dto.deactivated;
        }
        await ctx.services.userService.update({ runner, model: user, dto: serviceDto, });

        // change password?
        // create / update password
        if (ist.notNullable(dto.password)) {
          ctx.authorize(ctx.services.userPolicy.canUpdatePassword({ model: user }));
          const oldPassword = user.password;
          if (!oldPassword) {
            // create
            const passwordDto: ICreateUserPasswordDto = { password: dto.password };
            await ctx.services.userPasswordService.create({ runner, user, dto: passwordDto });
          } else {
            // update
            const passwordDto: IUpdateUserPasswordDto = { password: dto.password };
            await ctx.services.userPasswordService.update({ runner, model: oldPassword, dto: passwordDto });
          }
        }

        // link / unlink roles
        if (dto.role_ids?.length) {
          const currentUserRoles = assertDefined(user.userRoles);
          await authorizeAndSyncrhoniseUserRoles({
            ctx,
            currentUserRoles,
            role_ids: dto.role_ids,
            runner,
            user,
          });
        }
        return user;
      });
      return final;
    },
  },


  /**
   * SoftDelete a User
   */
  softDeleteUser: {
    type: GraphQLNonNull(GraphQLBoolean),
    args: { dto: { type: GraphQLNonNull(DeleteUserGqlInput), }, },
    resolve: async (parent, args, ctx): Promise<boolean> => {
      const dto = ctx.validate(DeleteUserValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const user = await ctx.services.userRepository.findByPkOrfail(dto.id, { runner, });
        ctx.authorize(ctx.services.userPolicy.canSoftDelete({ model: user }));
        await ctx.services.userService.delete({ model: user, runner });
        return user;
      });
      return true;
    },
  },


  /**
   * HardDelete a User
   */
  hardDeleteUser: {
    type: GraphQLNonNull(GraphQLBoolean),
    args: { dto: { type: GraphQLNonNull(DeleteUserGqlInput), }, },
    resolve: async (parent, args, ctx): Promise<boolean> => {
      const dto = ctx.validate(DeleteUserValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const user = await ctx.services.userRepository.findByPkOrfail(dto.id, { runner, });
        ctx.authorize(ctx.services.userPolicy.canSoftDelete({ model: user }));
        await ctx.services.userService.delete({ model: user, runner });
        return user;
      });
      return true;
    },
  },


  /**
   * Request a ForgottenPasswordReset email to be sent
   */
  requestForgottenUserPasswordReset: {
    type: GraphQLNonNull(GraphQLBoolean),
    args: { dto: { type: GraphQLNonNull(RequestResetForgottenUserPasswordGqlInput), }, },
    resolve: async (parent, args, ctx): Promise<true> => {
      const dto = ctx.validate(RequestResetForgottenUserPasswordGqlInputValidator, args.dto);
      await ctx.services.universal.db.transact(async ({ runner }) => {
        const user = await ctx.services.userRepository.findOne({
          runner,
          options: { where: { [UserField.email]: { [Op.eq]: dto.email, }, }, },
        });
        if (!user) return false;
        if (!ctx.services.userPolicy.canRequestForgottenPasswordReset({ model: user })) {
          logger.warn(`Failed to reset password for user id: "${user.id}", email: "${user.email}", name: "${user.name}"`);
          return false;
        };
        await ctx.services.userService.sendPasswordResetEmail({ model: user, runner });
      });
      return true;
    },
  },


  /**
   * Consume ForgottenUserPasswordReset token
   */
  consumeForgottenUserPasswordReset: {
    type: GraphQLNonNull(AuthenticationGqlNode),
    args: { dto: { type: GraphQLNonNull(ConsumeResetForgottenUserPasswordGqlInput), }, },
    resolve: async (parent, args, ctx): Promise<IAuthenticationGqlNodeSource> => {
      const dto = ctx.validate(ConsumeResetForgottenUserPasswordGqlInputValidator, args.dto);
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
          const message = ctx.lang(ExceptionLang.BadTokenType);
          throw ctx.except(BadRequestException({ message }));
        }

        // expired?
        if (token.isExpired()) {
          const message = ctx.lang(UserTokenLang.TokenExpired);
          throw ctx.except(BadRequestException({ message }));
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
        const systemPermissions = await ctx.services.universal.systemPermissions.getPermissions()
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
  requestUserWelcome: {
    type: GraphQLNonNull(GraphQLBoolean),
    args: { dto: { type: GraphQLNonNull(RequestUserWelcomeGqlInput), }, },
    resolve: async (parent, args, ctx): Promise<boolean> => {
      const dto = ctx.validate(RequestUserWelcomeGqlInputValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const user = await ctx.services.userRepository.findByPkOrfail(dto.user_id, { runner });
        ctx.authorize(ctx.services.userPolicy.canRequestWelcome({ model: user }));
        const result = await ctx.services.userService.sendWelcomeEmail({ model: user, runner });
        return result;
      });
      return final;
    },
  },


  /**
   * Accept a WelcomeEmail to a User that's been created for someone else, prompting them to set a name and password
   * 
   * TODO: return jwt & check cookies are being set...
   */
  consumeUserWelcome: {
    type: GraphQLNonNull(AuthenticationGqlNode),
    args: { dto: { type: GraphQLNonNull(ConsumeUserWelcomeGqlInput), }, },
    resolve: async (parent, args, ctx): Promise<IAuthenticationGqlNodeSource> => {
      const dto = ctx.validate(ConsumeUserWelcomeGqlInputValidator, args.dto);
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
        if (!token.isWelcome()) {
          const message = ctx.lang(ExceptionLang.BadTokenType);
          throw ctx.except(BadRequestException({ message }));
        }

        // expired?
        if (token.isExpired()) {
          const message = ctx.lang(UserTokenLang.TokenExpired);
          throw ctx.except(BadRequestException({ message }));
        }

        // authorize
        ctx.authorize(ctx.services.userPolicy.canAcceptWelcome({ model: user }));

        // update user
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
        const systemPermissions = await ctx.services.universal.systemPermissions.getPermissions()

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
   * Consume an EmailVerification Token & thereby Verify the Users email
   */
  consumeEmailVerification: {
    type: GraphQLNonNull(AuthenticationGqlNode),
    args: { dto: { type: GraphQLNonNull(ConsumeEmailVerificationGqlInput) }, },
    resolve: async (parent, args, ctx): Promise<IAuthenticationGqlNodeSource> => {
      const dto = ctx.validate(ConsumeEmaiLVerificationGqlInputValidator, args.dto);
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
          const message = ctx.lang(ExceptionLang.BadTokenType);
          throw ctx.except(BadRequestException({ message }));
        }

        // expired?
        if (token.isExpired()) {
          const message = ctx.lang(UserTokenLang.TokenExpired);
          throw ctx.except(BadRequestException({ message }));
        }

        // authorize
        ctx.authorize(ctx.services.userPolicy.canConsumeVerificationEmail({ model: user }));

        // update user
        const userServiceDto: IUserServiceUpdateUserDto = {
          // mark as verified
          verified: true,
        };

        await ctx.services.userService.update({ runner, dto: userServiceDto, model: user, });

        const userPermissions = assertDefined(user.roles).flatMap(role => assertDefined(role.permissions));
        const systemPermissions = await ctx.services.universal.systemPermissions.getPermissions()

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
  requestEmailChange: {
    type: GraphQLNonNull(GraphQLBoolean),
    args: { dto: { type: GraphQLNonNull(RequestUserEmailChangeGqlInput), }, },
    resolve: async (parent, args, ctx): Promise<boolean> => {
      const dto = ctx.validate(RequestUserEmailChangeGqlInputValidator, args.dto);
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
          throw ctx.except(BadRequestException({ message, data: { email: [message] } }))
        }
        ctx.authorize(ctx.services.userPolicy.canRequestEmailChange({ model: user }));
        const serviceDto: IUserServiceSendVerifyEmailChangeEmailDto = {
          email: dto.email,
        }
        const result = await ctx.services.userService.sendVerifyEmailChangeEmail({
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
   * Consume VerifyEmailChange
   */
  consumeEmailChangeVerification: {
    type: GraphQLNonNull(AuthenticationGqlNode),
    args: { dto: { type: GraphQLNonNull(ConsumeVerifyEmailChangeGqlInput) }, },
    resolve: async (parent, args, ctx): Promise<IAuthenticationGqlNodeSource> => {
      const dto = ctx.validate(ConsumeVerifyEmailChangeGqlInputValidator, args.dto);
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
          const message = ctx.lang(ExceptionLang.BadTokenType);
          throw ctx.except(BadRequestException({ message }));
        }

        // expired?
        if (token.isExpired()) {
          const message = ctx.lang(UserTokenLang.TokenExpired);
          throw ctx.except(BadRequestException({ message }));
        }

        // authorize
        ctx.authorize(ctx.services.userPolicy.canConsumeVerificationEmail({ model: user }));

        const data = unwrap.right(TUserTokenVerifyEmailChangeData.decode(token.data));

        // update user
        const userServiceDto: IUserServiceUpdateUserDto = {
          // mark as verified
          verified: true,
          email: data.email,
        };

        await ctx.services.userService.update({ runner, dto: userServiceDto, model: user, });

        const userPermissions = assertDefined(user.roles).flatMap(role => assertDefined(role.permissions));
        const systemPermissions = await ctx.services.universal.systemPermissions.getPermissions();

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


/**
 * Synchronise desired user-roles (with authorization)
 *
 * @param arg
 */
async function authorizeAndSyncrhoniseUserRoles(arg: {
  currentUserRoles: UserRoleModel[],
  role_ids: RoleId[];
  runner: QueryRunner;
  user: UserModel;
  ctx: GqlContext;
}): Promise<void> {
  const { runner, user, ctx, role_ids, currentUserRoles, } = arg;

  // fetch all
  const allRoles = await ctx.services.roleRepository.findAll({ runner, unscoped: true, });
  // extract & ensure all desired roles exist
  const allRolesMap = new Map(allRoles.map(role => [ role.id, role, ]));
  const desiredRolesMap: Map<RoleId, RoleModel> = new Map();
  const notFoundRoleIds: RoleId[] = [];
  role_ids.forEach(role_id => {
    const role = allRolesMap.get(role_id);
    if (role) desiredRolesMap.set(role_id, role);
    else notFoundRoleIds.push(role_id);
  });
  if (notFoundRoleIds.length) {
    throw ctx.except(NotFoundException({ message: ctx.lang(RoleLang.NotFound({ ids: notFoundRoleIds })) }));
  }

  // find missing & unexpected permissions from the role
  const {
    missing,
    unexpected,
  } = ctx
    .services
    .userService
    .diffUserRoles({
      current: currentUserRoles,
      desired: Array.from(desiredRolesMap.values()),
    });

  // verify missing permissions can be created
  const forbiddenFromCreating = missing.filter(role => !ctx
    .services
    .userRolePolicy
    .canCreate({ role, user }));

  if (forbiddenFromCreating.length) {
    throw ctx.except(ForbiddenException({
      message: ctx.lang(UserLang.ForbiddenAddingRoles({
        userName: user.name,
        roleNames: forbiddenFromCreating.map(perm => perm.name),
      })),
    }));
  }

  // verify unexpected permissions can be deleted
  const forbiddenFromDeleting = unexpected.filter(userRole => !ctx
    .services
    .userRolePolicy
    .canHardDelete({
      model: userRole,
      role: assertDefined(allRolesMap.get(userRole.role_id)),
      user,
    }));

  if (forbiddenFromDeleting.length) {
    throw ctx.except(ForbiddenException({
      message: ctx.lang(UserLang.ForbiddenDeletingRoles({
        userName: user.name,
        roleNames: forbiddenFromDeleting.map(userRole => assertDefined(allRolesMap.get(userRole.role_id)).name),
      })),
    }));
  }

  // do create
  await Promise.all(missing.map((role) => ctx
    .services
    .userRoleService
    .create({ runner, user, role, })));

  // do delete
  await Promise.all(unexpected.map((userRole) => ctx
    .services
    .userRoleService
    .delete({ model: userRole, runner, })));
}
