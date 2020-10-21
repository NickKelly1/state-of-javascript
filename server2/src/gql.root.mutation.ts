import { isLeft } from 'fp-ts/lib/Either';
import { GraphQLFormattedError } from 'graphql';
import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { Op } from 'sequelize';
import { ILoginGqlInput, ILoginGqlObj, LoginGqlInput, LoginGqlInputValidator, LoginGqlObj } from './app/auth/gql/login.gql';
import { RefreshGqlInput, RefreshGqlInputValidator, RefreshGqlObj } from './app/auth/gql/refresh.gql';
import { ISignupGqlObj, SignupGqlInput, SignupGqlInputValidator, SignupGqlObj } from './app/auth/gql/signup.gql';
import { RefreshTokenValidator } from './app/auth/token/refresh.token.gql';
import { CreateNewsArticleValidator, CreateNewsArticleGqlInput } from './app/news-article/dtos/create-news-article.gql';
import { INewsArticleGqlNode, NewsArticleGqlNode } from './app/news-article/gql/news-article.gql.node';
import { RoleAssociation } from './app/role/role.associations';
import { ICreateUserPasswordDto } from './app/user-password/dtos/create-user-password.dto';
import { ICreateUserDto } from './app/user/dtos/create-user.dto';
import { UserAssociation } from './app/user/user.associations';
import { UserField } from './app/user/user.attributes';
import { GqlContext } from './common/classes/gql.context';
import { BadRequestException } from './common/exceptions/types/bad-request.exception';
import { LoginExpiredException } from './common/exceptions/types/login-expired.exception';
import { NotFoundException } from './common/exceptions/types/not-found.exception';
import { assertDefined } from './common/helpers/assert-defined.helper';
import { prettyQ } from './common/helpers/pretty.helper';
import { ExceptionLang } from './common/i18n/packs/exception.lang';
import { logger } from './common/logger/logger';

export const GqlRootMutation = new GraphQLObjectType<undefined, GqlContext>({
  name: 'RootMutationType',
  fields: () => ({
    createNewsArticle: {
      type: GraphQLNonNull(NewsArticleGqlNode),
      args: { dto: { type: GraphQLNonNull(CreateNewsArticleGqlInput) } },
      resolve: async (parent, args, ctx): Promise<INewsArticleGqlNode> => {
        ctx.authorize(ctx.services.newsArticlePolicy().canCreate());
        const author_id = ctx.assertAuthentication();
        const dto = ctx.validate(CreateNewsArticleValidator, args.dto);
        const model = await ctx.services.dbService().transact(async ({ runner }) => {
          const author = await ctx.services.userRepository().findByPkOrfail(author_id, { runner, unscoped: true });
          const article = await ctx.services.newsArticleService().create({ runner, author, dto });
          return article;
        });
        return model;
      },
    },

    login: {
      type: GraphQLNonNull(LoginGqlObj),
      args: { dto: { type: GraphQLNonNull(LoginGqlInput) } },
      resolve: async (parent, args, ctx): Promise<ISignupGqlObj> => {
        const dto = ctx.validate(LoginGqlInputValidator, args.dto);

        const { user } = await ctx.services.dbService().transact(async ({ runner }) => {
          const user = await ctx.services.userRepository().findOneOrfail({ runner,
            options: {
              where: { [UserField.name]: { [Op.eq]: dto.name } },
              include: UserAssociation.password,
            },
          });

          const password = user.password;
          if (!password) {
            throw ctx.except(BadRequestException({
              message: ctx.lang(ExceptionLang.CannotLogIn({
                user: user.name,
              })),
            }));
          }

          const same = await ctx.services.userPasswordService().compare({
            password,
            raw: dto.password,
          });
          if (!same) {
            throw ctx.except(BadRequestException({
              message: ctx.lang(ExceptionLang.IncorrectPassword),
            }));
          }

          return { user, };
        });

        const access = ctx.services.jwtService().createAccessToken({ partial: { permissions: [], user_id: user.id } });
        const refresh = ctx.services.jwtService().createRefreshToken({ partial: { user_id: user.id } });
        const access_token = ctx.services.jwtService().signAccessToken({ access });
        const refresh_token = ctx.services.jwtService().signRefreshToken({ refresh });

        const obj: ILoginGqlObj = {
          access_token,
          refresh_token,
          access_token_object: access,
          refresh_token_object: refresh,
        };

        return obj;
      },
    },

    refresh: {
      type: GraphQLNonNull(RefreshGqlObj),
      args: { dto: { type: GraphQLNonNull(RefreshGqlInput) } },
      resolve: async (parent, args, ctx): Promise<ISignupGqlObj> => {
        const dto = ctx.validate(RefreshGqlInputValidator, args.dto);
        const mbRefresh = ctx.services.jwtService().decodeRefreshToken({ token: dto.refresh_token });

        // failed to validate token
        if (isLeft(mbRefresh)) { throw mbRefresh.left; }
        const incomingRefresh = mbRefresh.right
        if (ctx.services.jwtService().isExpired(incomingRefresh)) {
          throw ctx.except(LoginExpiredException());
        }

        const { user, roles, permissions } = await ctx.services.dbService().transact(async ({ runner }) => {
          const user = await ctx.services.userRepository().findByPkOrfail(incomingRefresh.user_id, {
            runner,
            options: {
              include: [{
                association: UserAssociation.roles,
                include: [{
                  association: RoleAssociation.permissions,
                }],
              }],
            },
          });
          const roles = assertDefined(user.roles);
          const permissions = assertDefined(roles.flatMap(role => assertDefined(role.permissions)));
          return { user, roles, permissions, };
        });

        const access = ctx.services.jwtService().createAccessToken({ partial: {
          permissions: permissions.map(perm => perm.id),
          user_id: user.id
        }});
        const refresh = ctx.services.jwtService().createRefreshToken({ partial: { user_id: user.id } });
        const access_token = ctx.services.jwtService().signAccessToken({ access });
        const refresh_token = ctx.services.jwtService().signRefreshToken({ refresh });

        const obj: ISignupGqlObj = {
          access_token,
          refresh_token,
          access_token_object: access,
          refresh_token_object: refresh,
        };

        return obj;
      },
    },

    signup: {
      type: GraphQLNonNull(SignupGqlObj),
      args: { dto: { type: GraphQLNonNull(SignupGqlInput) } },
      resolve: async (parent, args, ctx): Promise<ISignupGqlObj> => {
        const dto = ctx.validate(SignupGqlInputValidator, args.dto);

        const { user } = await ctx.services.dbService().transact(async ({ runner }) => {
          const userDto: ICreateUserDto = { name: dto.name };
          const user = await ctx.services.userService().create({ runner, dto: userDto, });
          const passwordDto: ICreateUserPasswordDto = { password: dto.password };
          const password = await ctx.services.userPasswordService().create({ runner, user, dto: passwordDto });
          return { user, };
        });

        const access = ctx.services.jwtService().createAccessToken({ partial: { permissions: [], user_id: user.id } });
        const refresh = ctx.services.jwtService().createRefreshToken({ partial: { user_id: user.id } });
        const access_token = ctx.services.jwtService().signAccessToken({ access });
        const refresh_token = ctx.services.jwtService().signRefreshToken({ refresh });

        const obj: ISignupGqlObj = {
          access_token,
          refresh_token,
          access_token_object: access,
          refresh_token_object: refresh,
        };

        return obj;
      },
    },
  }),
});
