import { GraphQLBoolean, GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { UserModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { ForbiddenException } from "../../../common/exceptions/types/forbidden.exception";
import { NotFoundException } from "../../../common/exceptions/types/not-found.exception";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { ist } from "../../../common/helpers/ist.helper";
import { RoleLang } from "../../role/role.lang";
import { QueryRunner } from "../../db/query-runner";
import { RoleId } from "../../role/role.id.type";
import { RoleModel } from "../../role/role.model";
import { ICreateUserPasswordDto } from "../../user-password/dtos/create-user-password.dto";
import { IUpdateUserPasswordDto } from "../../user-password/dtos/update-user-password.dto";
import { UserRoleModel } from "../../user-role/user-role.model";
import { CreateUserGqlInput, CreateUserValidator } from "../gql-input/create-user.gql";
import { DeleteUserGqlInput, DeleteUserValidator } from "../gql-input/delete-user.gql";
import { UpdateUserGqlInput, UpdateUserValidator } from "../gql-input/update-user.gql";
import { IUserServiceCreateUserDto } from "../service-dto/user-service.create-user.dto";
import { IUserServiceUpdateUserDto } from "../service-dto/user-service.update-user.dto";
import { UserAssociation } from "../user.associations";
import { IUserGqlNodeSource, UserGqlNode } from "./user.gql.node";
import { UserLang } from '../user.lang';

export const UserGqlMutations: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  /**
   * Create a User
   */
  createUser: {
    type: GraphQLNonNull(UserGqlNode),
    args: { dto: { type: GraphQLNonNull(CreateUserGqlInput), }, },
    resolve: async (parent, args, ctx): Promise<IUserGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.userPolicy.canAccess(), UserLang.CannotAccess);
      // authorise create
      ctx.authorize(ctx.services.userPolicy.canCreate(), UserLang.CannotCreate);
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
        ctx.services.userRepository._404Unless(ctx.services.userPolicy.canFindOne({ model: user }));
        ctx.authorize(ctx.services.userPolicy.canUpdate({ model: user }), UserLang.CannotUpdate({ model: user }));

        const serviceDto: IUserServiceUpdateUserDto = {
          name: dto.name ?? undefined,
          email: undefined,
          verified: undefined,
          deactivated: undefined,
        };

        // change email?
        if (ist.notNullable(dto.email) && user.email !== dto.email) {
          // verify can update email
          const lang = UserLang.CannotForceUpdateEmail({ model: user });
          ctx.authorize(ctx.services.userPolicy.canForceUpdateEmail({ model: user }), lang);
          serviceDto.email = dto.email;
        }

        // change verified?
        if (ist.notNullable(dto.verified) && user.verified !== dto.verified) {
          // verify can verify
          const lang = UserLang.CannotChangeVerification({ model: user });
          ctx.authorize(ctx.services.userPolicy.canForceVerify({ model: user }), lang);
          serviceDto.verified = dto.verified;
        }

        // deactivate?
        if (ist.notNullable(dto.deactivated) && user.deactivated !== dto.deactivated) {
          // verify can deactivate
          const lang = UserLang.CannotChangeActivation({ model: user });
          ctx.authorize(ctx.services.userPolicy.canDeactivate({ model: user }), lang);
          serviceDto.deactivated = dto.deactivated;
        }

        // do update
        await ctx.services.userService.update({ runner, model: user, dto: serviceDto, });

        // change password?
        if (ist.notNullable(dto.password)) {
          // verify can cahnge password
          const lang = UserLang.CannotUpdatePassword({ model: user });
          ctx.authorize(ctx.services.userPolicy.canUpdatePassword({ model: user }), lang);
          // create or update password
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
      await ctx.services.universal.db.transact(async ({ runner }) => {
        const user = await ctx.services.userRepository.findByPkOrfail(dto.id, { runner, });
        ctx.services.userRepository._404Unless(ctx.services.userPolicy.canFindOne({ model: user }));
        const lang = UserLang.CannotSoftDelete({ model: user });
        ctx.authorize(ctx.services.userPolicy.canSoftDelete({ model: user }), lang);
        await ctx.services.userService.softDelete({ model: user, runner });
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
      await ctx.services.universal.db.transact(async ({ runner }) => {
        const user = await ctx.services.userRepository.findByPkOrfail(dto.id, { runner, });
        ctx.services.userRepository._404Unless(ctx.services.userPolicy.canFindOne({ model: user }));
        const lang = UserLang.CannotHardDelete({ model: user });
        ctx.authorize(ctx.services.userPolicy.canHardDelete({ model: user }), lang);
        await ctx.services.userService.softDelete({ model: user, runner });
        return user;
      });
      return true;
    },
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
    const message = ctx.lang(RoleLang.IdsNotFound({ ids: notFoundRoleIds }));
    throw new NotFoundException(message);
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
    const message = ctx.lang(UserLang.ForbiddenAddingRoles({
      userName: user.name,
      roleNames: forbiddenFromCreating.map(perm => perm.name),
    }));
    throw new ForbiddenException(message);
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
    const message = ctx.lang(UserLang.ForbiddenDeletingRoles({
      userName: user.name,
      roleNames: forbiddenFromDeleting.map(userRole => assertDefined(allRolesMap.get(userRole.role_id)).name),
    }));
    throw new ForbiddenException(message);
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
