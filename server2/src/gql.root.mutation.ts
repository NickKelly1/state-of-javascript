import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { CreateNewsArticleValidator, CreateNewsArticleGqlInput } from './app/news-article/dtos/create-news-article.gql';
import { UpdateNewsArticleGqlInput, UpdateNewsArticleValidator } from './app/news-article/dtos/update-news-article.gql';
import { INewsArticleGqlNodeSource, NewsArticleGqlNode } from './app/news-article/gql/news-article.gql.node';
import { NewsArticleAssociation } from './app/news-article/news-article.associations';
import { NewsArticleModel } from './app/news-article/news-article.model';
import { UserModel } from './app/user/user.model';
import { GqlContext } from './common/classes/gql.context';
import { assertDefined } from './common/helpers/assert-defined.helper';

export const GqlRootMutation = new GraphQLObjectType<undefined, GqlContext>({
  name: 'RootMutationType',
  fields: () => ({
    createNewsArticle: {
      type: GraphQLNonNull(NewsArticleGqlNode),
      args: { dto: { type: GraphQLNonNull(CreateNewsArticleGqlInput) } },
      resolve: async (parent, args, ctx): Promise<INewsArticleGqlNodeSource> => {
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

    updateNewsArticle: {
      type: GraphQLNonNull(NewsArticleGqlNode),
      args: { dto: { type: GraphQLNonNull(UpdateNewsArticleGqlInput) } },
      resolve: async (parent, args, ctx): Promise<INewsArticleGqlNodeSource> => {
        ctx.authorize(ctx.services.newsArticlePolicy().canCreate());
        const dto = ctx.validate(UpdateNewsArticleValidator, args.dto);
        const model = await ctx.services.dbService().transact(async ({ runner }) => {
          const model: NewsArticleModel = await ctx.services.newsArticleRepository().findByPkOrfail(dto.id, {
            runner,
            options: {
              include: [{ association: NewsArticleAssociation.author, }]
            },
          });
          const author: UserModel = assertDefined(model.author);
          ctx.loader.users.prime(model.author_id, author);
          ctx.authorize(ctx.services.newsArticlePolicy().canUpdate({ author, model }));
          await ctx.services.newsArticleService().update({ runner, author, dto, model });
          return model;
        });
        return model;
      },
    },

    deleteNewsArticle: {
      type: GraphQLNonNull(NewsArticleGqlNode),
      args: { dto: { type: GraphQLNonNull(UpdateNewsArticleGqlInput) } },
      resolve: async (parent, args, ctx): Promise<INewsArticleGqlNodeSource> => {
        ctx.authorize(ctx.services.newsArticlePolicy().canCreate());
        const dto = ctx.validate(UpdateNewsArticleValidator, args.dto);
        const model = await ctx.services.dbService().transact(async ({ runner }) => {
          const model: NewsArticleModel = await ctx.services.newsArticleRepository().findByPkOrfail(dto.id, {
            runner,
            options: {
              include: [{ association: NewsArticleAssociation.author, }]
            },
          });
          const author: UserModel = assertDefined(model.author);
          ctx.loader.users.prime(model.author_id, author);
          ctx.authorize(ctx.services.newsArticlePolicy().canUpdate({ author, model }));
          await ctx.services.newsArticleService().update({ runner, author, dto, model });
          return model;
        });
        return model;
      },
    },
  }),
});
