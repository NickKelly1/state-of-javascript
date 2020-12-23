import { GraphQLBoolean, GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { BlogPostModel, UserModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { BlogPostLang } from "../blog-post.lang";
import { BlogPostAssociation } from "../blog-post.associations";
import { CreateBlogPostGqlInput, CreateBlogPostValidator } from "../dtos/create-blog-post.gql.input";
import { TargetBlogPostGqlInput, TargetBlogPostValidator } from "../dtos/target-blog-post.gql.input";
import { UpdateBlogPostGqlInput, UpdateBlogPostValidator } from "../dtos/update-blog-post.gql.input";
import { IBlogPostGqlNodeSource, BlogPostGqlNode } from "./blog-post.gql.node";

export const BlogPostGqlMutations: Thunk<GraphQLFieldConfigMap<undefined, GqlContext>> = () => ({
  /**
   * Create a BlogPost
   */
  createBlogPost: {
    type: GraphQLNonNull(BlogPostGqlNode),
    args: { dto: { type: GraphQLNonNull(CreateBlogPostGqlInput) } },
    resolve: async (parent, args, ctx): Promise<IBlogPostGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.blogPostPolicy.canAccess(), BlogPostLang.CannotAccess);
      // authorise create
      ctx.authorize(ctx.services.blogPostPolicy.canCreate(), BlogPostLang.CannotCreate);
      // ensure authenticated
      const author_id = ctx.assertAuthentication();
      // validate
      const dto = ctx.validate(CreateBlogPostValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const author = await ctx.services.userRepository.findByPkOrfail(author_id, { runner, unscoped: true });
        // do create
        const model = await ctx.services.blogPostService.create({ runner, author, dto });
        return model;
      });
      return final;
    },
  },


  /**
   * Update a BlogPost
   */
  updateBlogPost: {
    type: GraphQLNonNull(BlogPostGqlNode),
    args: { dto: { type: GraphQLNonNull(UpdateBlogPostGqlInput) } },
    resolve: async (parent, args, ctx): Promise<IBlogPostGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.blogPostPolicy.canAccess(), BlogPostLang.CannotAccess);
      // validate
      const dto = ctx.validate(UpdateBlogPostValidator, args.dto);

      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const model: BlogPostModel = await ctx.services.blogPostRepository.findByPkOrfail(dto.id, {
          runner,
          options: { include: [{ association: BlogPostAssociation.author, }] },
        });
        // authorise view
        ctx.services.blogPostRepository._404Unless(ctx.services.blogPostPolicy.canFindOne({ model }));
        const author: UserModel = assertDefined(model.author);
        // authorise update
        ctx.authorize(ctx.services.blogPostPolicy.canUpdate({ model }), BlogPostLang.CannotUpdate({ model }));
        // do update
        await ctx.services.blogPostService.update({ runner, author, dto, model });
        return model;
      });

      return final;
    },
  },


  /**
   * SoftDelete a BlogPost
   */
  softDeleteBlogPost: {
    type: GraphQLNonNull(BlogPostGqlNode),
    args: { dto: { type: GraphQLNonNull(TargetBlogPostGqlInput) } },
    resolve: async (parent, args, ctx): Promise<IBlogPostGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.blogPostPolicy.canAccess(), BlogPostLang.CannotAccess);
      // validate
      const dto = ctx.validate(TargetBlogPostValidator, args.dto);

      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const model: BlogPostModel = await ctx.services.blogPostRepository.findByPkOrfail(dto.id, {
          runner,
          options: { include: [{ association: BlogPostAssociation.author, }] },
        });
        // authorise view
        ctx.services.blogPostRepository._404Unless(ctx.services.blogPostPolicy.canFindOne({ model }));
        const author: UserModel = assertDefined(model.author);
        // authorise soft-delete
        ctx.authorize(ctx.services.blogPostPolicy.canSoftDelete({ model }), BlogPostLang.CannotSoftDelete({ model }));
        // soft-delete
        await ctx.services.blogPostService.softDelete({ runner, author, model });
        return model;
      });

      return final;
    },
  },


  /**
   * HardDelete a BlogPost
   */
  hardDeleteBlogPost: {
    type: GraphQLNonNull(GraphQLBoolean),
    args: { dto: { type: GraphQLNonNull(TargetBlogPostGqlInput) } },
    resolve: async (parent, args, ctx): Promise<boolean> => {
      // authorise access
      ctx.authorize(ctx.services.blogPostPolicy.canAccess(), BlogPostLang.CannotAccess);
      // validate
      const dto = ctx.validate(TargetBlogPostValidator, args.dto);

      await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const model: BlogPostModel = await ctx.services.blogPostRepository.findByPkOrfail(dto.id, {
          runner,
          options: { include: [{ association: BlogPostAssociation.author, }] },
        });
        // authorise view
        ctx.services.blogPostRepository._404Unless(ctx.services.blogPostPolicy.canFindOne({ model }));
        const author: UserModel = assertDefined(model.author);
        // authorise hard-delete
        ctx.authorize(ctx.services.blogPostPolicy.canHardDelete({ model }), BlogPostLang.CannotHardDelete({ model }));
        // do hard-delete
        await ctx.services.blogPostService.hardDelete({ runner, author, model });
        return model;
      });

      return true;
    },
  },


  /**
   * Restore a BlogPost
   */
  restoreBlogPost: {
    type: GraphQLNonNull(BlogPostGqlNode),
    args: { dto: { type: GraphQLNonNull(TargetBlogPostGqlInput) } },
    resolve: async (parent, args, ctx): Promise<IBlogPostGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.blogPostPolicy.canAccess(), BlogPostLang.CannotAccess);
      // validate
      const dto = ctx.validate(TargetBlogPostValidator, args.dto);

      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const model: BlogPostModel = await ctx.services.blogPostRepository.findByPkOrfail(dto.id, {
          runner,
          options: { include: [{ association: BlogPostAssociation.author, }] },
        });
        // authorise view
        ctx.services.blogPostRepository._404Unless(ctx.services.blogPostPolicy.canFindOne({ model }));
        const author: UserModel = assertDefined(model.author);
        // authorise restore
        ctx.authorize(ctx.services.blogPostPolicy.canRestore({ model }), BlogPostLang.CannotRestore({ model }));
        // do restore
        await ctx.services.blogPostService.restore({ runner, author, model });
        return model;
      });

      return final;
    },
  },


  /**
   * Submit a BlogPost
   */
  submitBlogPost: {
    type: GraphQLNonNull(BlogPostGqlNode),
    args: { dto: { type: GraphQLNonNull(TargetBlogPostGqlInput) } },
    resolve: async (parent, args, ctx): Promise<IBlogPostGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.blogPostPolicy.canAccess(), BlogPostLang.CannotAccess);
      // validate
      const dto = ctx.validate(TargetBlogPostValidator, args.dto);

      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const model: BlogPostModel = await ctx.services.blogPostRepository.findByPkOrfail(dto.id, { runner, });
        // authorise view
        ctx.services.blogPostRepository._404Unless(ctx.services.blogPostPolicy.canFindOne({ model }));
        // authorise submit
        ctx.authorize(ctx.services.blogPostPolicy.canSubmit({ model }), BlogPostLang.CannotSubmit({ model }));
        // do submit
        await ctx.services.blogPostService.submit({ runner, model });
        return model;
      });

      return final;
    },
  },


  /**
   * Reject a BlogPost
   */
  rejectBlogPost: {
    type: GraphQLNonNull(BlogPostGqlNode),
    args: { dto: { type: GraphQLNonNull(TargetBlogPostGqlInput) } },
    resolve: async (parent, args, ctx): Promise<IBlogPostGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.blogPostPolicy.canAccess(), BlogPostLang.CannotAccess);
      // validate
      const dto = ctx.validate(TargetBlogPostValidator, args.dto);

      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const model = await ctx.services.blogPostRepository.findByPkOrfail(dto.id, { runner, });
        // authorise view
        ctx.services.blogPostRepository._404Unless(ctx.services.blogPostPolicy.canFindOne({ model }));
        // authorise reject
        ctx.authorize(ctx.services.blogPostPolicy.canReject({ model }), BlogPostLang.CannotReject({ model }));
        // do reject
        await ctx.services.blogPostService.reject({ runner, model });
        return model;
      });

      return final;
    },
  },


  /**
   * Approve a BlogPost
   */
  approveBlogPost: {
    type: GraphQLNonNull(BlogPostGqlNode),
    args: { dto: { type: GraphQLNonNull(TargetBlogPostGqlInput) } },
    resolve: async (parent, args, ctx): Promise<IBlogPostGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.blogPostPolicy.canAccess(), BlogPostLang.CannotAccess);
      // validate
      const dto = ctx.validate(TargetBlogPostValidator, args.dto);

      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const model = await ctx.services.blogPostRepository.findByPkOrfail(dto.id, { runner, });
        // authorise view
        ctx.services.blogPostRepository._404Unless(ctx.services.blogPostPolicy.canFindOne({ model }));
        // authorise approve
        ctx.authorize(ctx.services.blogPostPolicy.canApprove({ model }), BlogPostLang.CannotApprove({ model }));
        // do approve
        await ctx.services.blogPostService.approve({ runner, model });
        return model;
      });

      return final;
    },
  },


  /**
   * Publish a BlogPost
   */
  publishBlogPost: {
    type: GraphQLNonNull(BlogPostGqlNode),
    args: { dto: { type: GraphQLNonNull(TargetBlogPostGqlInput) } },
    resolve: async (parent, args, ctx): Promise<IBlogPostGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.blogPostPolicy.canAccess(), BlogPostLang.CannotAccess);
      // validate
      const dto = ctx.validate(TargetBlogPostValidator, args.dto);

      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const model = await ctx.services.blogPostRepository.findByPkOrfail(dto.id, { runner, });
        // authorise view
        ctx.services.blogPostRepository._404Unless(ctx.services.blogPostPolicy.canFindOne({ model }));
        // authorise publish
        ctx.authorize(ctx.services.blogPostPolicy.canPublish({ model }), BlogPostLang.CannotPublish({ model }));
        // do publish
        await ctx.services.blogPostService.publish({ runner, model });
        return model;
      });

      return final;
    },
  },


  /**
   * Unpublish a BlogPost
   */
  unpublishBlogPost: {
    type: GraphQLNonNull(BlogPostGqlNode),
    args: { dto: { type: GraphQLNonNull(TargetBlogPostGqlInput) } },
    resolve: async (parent, args, ctx): Promise<IBlogPostGqlNodeSource> => {
      // auhorise access
      ctx.authorize(ctx.services.blogPostPolicy.canAccess(), BlogPostLang.CannotAccess);
      // validate
      const dto = ctx.validate(TargetBlogPostValidator, args.dto);

      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const model = await ctx.services.blogPostRepository.findByPkOrfail(dto.id, { runner, });
        // authorise view
        ctx.services.blogPostRepository._404Unless(ctx.services.blogPostPolicy.canFindOne({ model }));
        // authorise unpublish
        ctx.authorize(ctx.services.blogPostPolicy.canUnpublish({ model }), BlogPostLang.CannotUnpublish({ model }));
        // unpublish
        await ctx.services.blogPostService.unpublish({ runner, model });
        return model;
      });

      return final;
    },
  },
});