import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { NewsArticleModel, UserModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { CreateNewsArticleGqlInput, CreateNewsArticleValidator } from "../dtos/create-news-article.gql";
import { DeleteNewsArticleGqlInput, DeleteNewsArticleValidator } from "../dtos/delete-news-article.gql";
import { UpdateNewsArticleGqlInput, UpdateNewsArticleValidator } from "../dtos/update-news-article.gql";
import { NewsArticleAssociation } from "../news-article.associations";
import { INewsArticleGqlNodeSource, NewsArticleGqlNode } from "./news-article.gql.node";

export const NewsArticleGqlMutations: Thunk<GraphQLFieldConfigMap<undefined, GqlContext>> = () => ({
  createNewsArticle: {
    type: GraphQLNonNull(NewsArticleGqlNode),
    args: { dto: { type: GraphQLNonNull(CreateNewsArticleGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INewsArticleGqlNodeSource> => {
      ctx.authorize(ctx.services.newsArticlePolicy.canCreate());
      const author_id = ctx.assertAuthentication();
      const dto = ctx.validate(CreateNewsArticleValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
        const author = await ctx.services.userRepository.findByPkOrfail(author_id, { runner, unscoped: true });
        const article = await ctx.services.newsArticleService.create({ runner, author, dto });
        return article;
      });
      return model;
    },
  },

  updateNewsArticle: {
    type: GraphQLNonNull(NewsArticleGqlNode),
    args: { dto: { type: GraphQLNonNull(UpdateNewsArticleGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INewsArticleGqlNodeSource> => {
      const dto = ctx.validate(UpdateNewsArticleValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
        const model: NewsArticleModel = await ctx.services.newsArticleRepository.findByPkOrfail(dto.id, {
          runner,
          options: {
            include: [{ association: NewsArticleAssociation.author, }]
          },
        });
        const author: UserModel = assertDefined(model.author);
        ctx.authorize(ctx.services.newsArticlePolicy.canUpdate({ author, model }));
        await ctx.services.newsArticleService.update({ runner, author, dto, model });
        return model;
      });
      return model;
    },
  },

  deleteNewsArticle: {
    type: GraphQLNonNull(NewsArticleGqlNode),
    args: { dto: { type: GraphQLNonNull(DeleteNewsArticleGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INewsArticleGqlNodeSource> => {
      const dto = ctx.validate(DeleteNewsArticleValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
        const model: NewsArticleModel = await ctx.services.newsArticleRepository.findByPkOrfail(dto.id, {
          runner,
          options: {
            include: [{ association: NewsArticleAssociation.author, }]
          },
        });
        const author: UserModel = assertDefined(model.author);
        ctx.authorize(ctx.services.newsArticlePolicy.canDelete({ author, model }));
        await ctx.services.newsArticleService.delete({ runner, author, model });
        return model;
      });
      return model;
    },
  },
});