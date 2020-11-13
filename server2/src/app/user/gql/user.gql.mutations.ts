import { GraphQLBoolean, GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { UserModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { ForbiddenException } from "../../../common/exceptions/types/forbidden.exception";
import { NotFoundException } from "../../../common/exceptions/types/not-found.exception";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { RoleLang } from "../../../common/i18n/packs/role.lang";
import { UserLang } from "../../../common/i18n/packs/user.lang";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { OrNull } from "../../../common/types/or-null.type";
import { QueryRunner } from "../../db/query-runner";
import { CreateNewsArticleGqlInput } from "../../news-article/dtos/create-news-article.gql";
import { RoleId } from "../../role/role.id.type";
import { RoleModel } from "../../role/role.model";
import { UserRoleModel } from "../../user-role/user-role.model";
import { CreateUserGqlInput, CreateUserValidator } from "../dtos/create-user.gql";
import { DeleteUserGqlInput, DeleteUserValidator } from "../dtos/delete-user.gql";
import { UpdateUserGqlInput, UpdateUserValidator } from "../dtos/update-user.gql";
import { UserAssociation } from "../user.associations";
import { IUserCollectionGqlNodeSource, UserCollectionGqlNode } from "./user.collection.gql.node";
import { UserCollectionOptionsGqlInput } from "./user.collection.gql.options";
import { IUserGqlNodeSource, UserGqlNode } from "./user.gql.node";

export const UserGqlMutations: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  createUser: {
    type: GraphQLNonNull(UserGqlNode),
    args: { dto: { type: GraphQLNonNull(CreateUserGqlInput), }, },
    resolve: async (parent, args, ctx): Promise<IUserGqlNodeSource> => {
      ctx.authorize(ctx.services.userPolicy.canCreate());
      const dto = ctx.validate(CreateUserValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
        const user = await ctx.services.userService.create({ runner, dto: { name: dto.name, }, });
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
      return model;
    },
  },

  updateUser: {
    type: GraphQLNonNull(UserGqlNode),
    args: { dto: { type: GraphQLNonNull(UpdateUserGqlInput), }, },
    resolve: async (parent, args, ctx): Promise<IUserGqlNodeSource> => {
      const dto = ctx.validate(UpdateUserValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
        const user = await ctx.services.userRepository.findByPkOrfail(dto.id, {
          runner,
          options: { include: [{ association: UserAssociation.userRoles }] },
        });
        ctx.authorize(ctx.services.userPolicy.canUpdate({ model: user }));
        await ctx.services.userService.update({ runner, model: user, dto: { name: dto.name ?? undefined, }, });
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
      return model;
    },
  },

  deleteUser: {
    type: GraphQLNonNull(GraphQLBoolean),
    args: { dto: { type: GraphQLNonNull(DeleteUserGqlInput), }, },
    resolve: async (parent, args, ctx): Promise<boolean> => {
      const dto = ctx.validate(DeleteUserValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
        const user = await ctx.services.userRepository.findByPkOrfail(dto.id, { runner, });
        ctx.authorize(ctx.services.userPolicy.canDelete({ model: user }));
        await ctx.services.userService.delete({ model: user, runner });
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
    .canDelete({
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
