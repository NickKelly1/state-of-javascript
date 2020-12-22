import { GraphQLBoolean, GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { NewsArticleModel, UserModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { CreateNewsArticleGqlInput, CreateNewsArticleValidator } from "../dtos/create-news-article.gql";
import { DeleteNewsArticleGqlInput, DeleteNewsArticleValidator } from "../dtos/delete-news-article.gql";
import { UpdateNewsArticleGqlInput, UpdateNewsArticleValidator } from "../dtos/update-news-article.gql";
import { NewsArticleAssociation } from "../news-article.associations";
import { NewsArticleLang } from "../news-article.lang";
import { INewsArticleGqlNodeSource, NewsArticleGqlNode } from "./news-article.gql.node";

export const NewsArticleGqlMutations: Thunk<GraphQLFieldConfigMap<undefined, GqlContext>> = () => ({
  /**
   * Create a NewsArticle
   */
  createNewsArticle: {
    type: GraphQLNonNull(NewsArticleGqlNode),
    args: { dto: { type: GraphQLNonNull(CreateNewsArticleGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INewsArticleGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.newsArticlePolicy.canAccess(), NewsArticleLang.CannotAccess);
      // authorise create
      ctx.authorize(ctx.services.newsArticlePolicy.canCreate(), NewsArticleLang.CannotCreate);
      // ensure authenticated
      const author_id = ctx.assertAuthentication();
      // validate
      const dto = ctx.validate(CreateNewsArticleValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const author = await ctx.services.userRepository.findByPkOrfail(author_id, { runner, unscoped: true });
        // do create
        const model = await ctx.services.newsArticleService.create({ runner, author, dto });
        return model;
      });
      return final;
    },
  },


  /**
   * Update a NewsArticle
   */
  updateNewsArticle: {
    type: GraphQLNonNull(NewsArticleGqlNode),
    args: { dto: { type: GraphQLNonNull(UpdateNewsArticleGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INewsArticleGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.newsArticlePolicy.canAccess(), NewsArticleLang.CannotAccess);
      // validate
      const dto = ctx.validate(UpdateNewsArticleValidator, args.dto);

      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const model: NewsArticleModel = await ctx.services.newsArticleRepository.findByPkOrfail(dto.id, {
          runner,
          options: { include: [{ association: NewsArticleAssociation.author, }], },
        });
        const author: UserModel = assertDefined(model.author);
        // authorise view
        ctx.services.newsArticleRepository._404Unless(ctx.services.newsArticlePolicy.canFindOne({ model }));
        // authorise update
        ctx.authorize(
          ctx.services.newsArticlePolicy.canUpdate({ model }),
          NewsArticleLang.CannotUpdate({ model }),
        );
        // do update
        await ctx.services.newsArticleService.update({ runner, author, dto, model });
        return model;
      });

      return final;
    },
  },


  /**
   * SoftDelete a NewsArticle
   */
  softDeleteNewsArticle: {
    type: GraphQLNonNull(NewsArticleGqlNode),
    args: { dto: { type: GraphQLNonNull(DeleteNewsArticleGqlInput) } },
    resolve: async (parent, args, ctx): Promise<INewsArticleGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.newsArticlePolicy.canAccess(), NewsArticleLang.CannotAccess);
      // validate
      const dto = ctx.validate(DeleteNewsArticleValidator, args.dto);

      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const model = await ctx.services.newsArticleRepository.findByPkOrfail(dto.id, {
          runner,
          options: {
            include: [{ association: NewsArticleAssociation.author, }]
          },
        });
        const author: UserModel = assertDefined(model.author);
        // authorise view
        ctx.services.newsArticleRepository._404Unless(ctx.services.newsArticlePolicy.canFindOne({ model }));
        // authorise softDelete
        ctx.authorize(
          ctx.services.newsArticlePolicy.canSoftDelete({ model }),
          NewsArticleLang.CannotSoftDelete({ model }),
        );
        // do softDelete
        await ctx.services.newsArticleService.softDelete({ runner, author, model });
        return model;
      });

      return final;
    },
  },


  /**
   * HardDelete a NewsArticle
   */
  hardDeleteNewsArticle: {
    type: GraphQLNonNull(GraphQLBoolean),
    args: { dto: { type: GraphQLNonNull(DeleteNewsArticleGqlInput) } },
    resolve: async (parent, args, ctx): Promise<boolean> => {
      // authorise access
      ctx.authorize(ctx.services.newsArticlePolicy.canAccess(), NewsArticleLang.CannotAccess);
      // validate
      const dto = ctx.validate(DeleteNewsArticleValidator, args.dto);

      await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const model = await ctx.services.newsArticleRepository.findByPkOrfail(dto.id, {
          runner,
          options: {
            include: [{ association: NewsArticleAssociation.author, }]
          },
        });
        const author: UserModel = assertDefined(model.author);
        // authorise view
        ctx.services.newsArticleRepository._404Unless(ctx.services.newsArticlePolicy.canFindOne({ model }));
        // authorise softDelete
        ctx.authorize(
          ctx.services.newsArticlePolicy.canHardDelete({ model }),
          NewsArticleLang.CannotHardDelete({ model }),
        );
        // do softDelete
        await ctx.services.newsArticleService.softDelete({ runner, author, model });
        return model;
      });

      return true;
    },
  },
});