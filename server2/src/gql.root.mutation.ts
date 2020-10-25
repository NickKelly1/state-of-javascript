import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { CreateNewsArticleValidator, CreateNewsArticleGqlInput } from './app/news-article/dtos/create-news-article.gql';
import { INewsArticleGqlNodeSource, NewsArticleGqlNode } from './app/news-article/gql/news-article.gql.node';
import { GqlContext } from './common/classes/gql.context';

export const GqlRootMutation = new GraphQLObjectType<undefined, GqlContext>({
  name: 'RootMutationType',
  fields: () => ({
    createNewsArticle: {
      type: GraphQLNonNull(NewsArticleGqlNode),
      args: { dto: { type: GraphQLNonNull(CreateNewsArticleGqlInput) } },
      resolve: async (parent, args, ctx): Promise<INewsArticleGqlNodeSource> => {
        const { req, res } = ctx;
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
