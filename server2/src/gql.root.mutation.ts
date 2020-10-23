import { isLeft } from 'fp-ts/lib/Either';
import { GraphQLFormattedError } from 'graphql';
import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { Op } from 'sequelize';
import { IAuthorisationRo } from './app/auth/gql/authorisation.gql';
import { LoginGqlInput, LoginGqlInputValidator } from './app/auth/gql/login.gql';
import { RefreshGqlInput, RefreshGqlInputValidator } from './app/auth/gql/refresh.gql';
import { ISignupGqlObj, SignupGqlInput, SignupGqlInputValidator } from './app/auth/gql/signup.gql';
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
import { assertDefined } from './common/helpers/assert-defined.helper';
import { ExceptionLang } from './common/i18n/packs/exception.lang';

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
  }),
});
