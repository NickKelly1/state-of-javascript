import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { BlogPostCommentModel, UserModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { IBlogPostCommentGqlNodeSource, BlogPostCommentGqlNode } from "./blog-post-comment.gql.node";
import { BlogPostCommentLang } from '../blog-post-comment.lang';
import { CreateBlogPostCommentGqlInput, CreateBlogPostCommentValidator } from "../dtos/create-blog-post-comment.gql.input";
import { IBlogPostCommentServiceCreateBlogPostCommentDto, IBlogPostCommentServiceUpdateBlogPostCommentDto } from "../blog-post-comment.service";
import { UpdateBlogPostCommentGqlInput, UpdateBlogPostCommentValidator } from "../dtos/update-blog-post-comment.gql.input";
import { BlogPostCommentAssociation } from "../blog-post-comment.associations";
import { BlogPostModel } from "../../blog-post/blog-post.model";
import { ist } from "../../../common/helpers/ist.helper";
import { TargetBlogPostCommentGqlInput, TargetBlogPostCommentValidator  } from '../dtos/target-blog-post-comment.gql.input';

export const BlogPostCommentGqlMutations: Thunk<GraphQLFieldConfigMap<undefined, GqlContext>> = () => ({
  /**
   * Create a BlogPostComment
   */
  createBlogPostComment: {
    type: GraphQLNonNull(BlogPostCommentGqlNode),
    args: { dto: { type: GraphQLNonNull(CreateBlogPostCommentGqlInput) } },
    resolve: async (parent, args, ctx): Promise<IBlogPostCommentGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.blogPostCommentPolicy.canAccess(), BlogPostCommentLang.CannotAccess);
      // authorise create
      ctx.authorize(ctx.services.blogPostCommentPolicy.canCreate(), BlogPostCommentLang.CannotCreate);
      // ensure authenticated
      const author_id = ctx.assertAuthentication();
      const dto = ctx.validate(CreateBlogPostCommentValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const post = await ctx.services.blogPostRepository.findByPkOrfail(dto.blog_post_id, { runner, });
        // authorise view
        ctx.services.blogPostRepository._404Unless(ctx.services.blogPostPolicy.canFindOne({ model: post }));
        // authorise create
        ctx.authorize(
          ctx.services.blogPostCommentPolicy.canCreateForBlogPost({ post, }),
          BlogPostCommentLang.CannotCreateForBlogPost,
        );
        const author = await ctx.services.userRepository.findByPkOrfail(author_id, { runner, unscoped: true });
        // do create
        const serviceDto: IBlogPostCommentServiceCreateBlogPostCommentDto = { body: dto.body, };
        const model = await ctx.services.blogPostCommentService.create({ runner, author, post, dto: serviceDto, });
        return model;
      });
      return final;
    },
  },

  /**
   * Update a BlogPostComment
   */
  updateBlogPostComment: {
    type: GraphQLNonNull(BlogPostCommentGqlNode),
    args: { dto: { type: GraphQLNonNull(UpdateBlogPostCommentGqlInput) } },
    resolve: async (parent, args, ctx): Promise<IBlogPostCommentGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.blogPostCommentPolicy.canAccess(), BlogPostCommentLang.CannotAccess);
      // validate
      const dto = ctx.validate(UpdateBlogPostCommentValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const model = await ctx.services.blogPostCommentRepository.findByPkOrfail(dto.id, {
          runner,
          options: { include: [
            { association: BlogPostCommentAssociation.author, },
            { association: BlogPostCommentAssociation.post, },
          ] },
        });
        const author: UserModel = assertDefined(model.author);
        const post: BlogPostModel = assertDefined(model.post);
        // authorise view
        ctx.services.blogPostCommentRepository._404Unless(ctx.services.blogPostCommentPolicy.canFindOne({ model, post, }));
        // authorise updating
        ctx.authorize(
          ctx.services.blogPostCommentPolicy.canUpdate({ model, post, },),
          BlogPostCommentLang.CannotUpdate({ model, }),
        );
        // dto
        const serviceDto: IBlogPostCommentServiceUpdateBlogPostCommentDto = { body: dto.body ?? undefined, };
        // authorise hiding
        if (ist.notNullable(dto.hidden) && (dto.hidden !== model.hidden)) {
          const lang = BlogPostCommentLang.CannotHide({ model });
          ctx.authorize(ctx.services.blogPostCommentPolicy.canHide({ model, post, }), lang);
          serviceDto.hidden = dto.hidden;
        }
        // authorise vanishing
        if (ist.notNullable(dto.visible) && (dto.visible !== model.hidden)) {
          const lang = BlogPostCommentLang.CannotVanish({ model });
          ctx.authorize(ctx.services.blogPostCommentPolicy.canVanish({ model, post, }), lang);
          serviceDto.visible = dto.visible;
        }
        // do update
        await ctx.services.blogPostCommentService.update({ runner, author, post, dto: serviceDto, model });
        return model;
      });
      return final;
    },
  },

  /**
   * SoftDelete a BlogPostComment
   */
  softDeleteBlogPostComment: {
    type: GraphQLNonNull(BlogPostCommentGqlNode),
    args: { dto: { type: GraphQLNonNull(TargetBlogPostCommentGqlInput) } },
    resolve: async (parent, args, ctx): Promise<IBlogPostCommentGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.blogPostCommentPolicy.canAccess(), BlogPostCommentLang.CannotAccess);
      // validate
      const dto = ctx.validate(TargetBlogPostCommentValidator, args.dto);
      const model = await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const model: BlogPostCommentModel = await ctx.services.blogPostCommentRepository.findByPkOrfail(dto.id, {
          runner,
          options: { include: [
              { association: BlogPostCommentAssociation.author, },
              { association: BlogPostCommentAssociation.post, },
          ] },
        });
        const author: UserModel = assertDefined(model.author);
        const post: BlogPostModel = assertDefined(model.post);
        // authorise accessing
        ctx.services.blogPostCommentRepository._404Unless(ctx.services.blogPostCommentPolicy.canFindOne({ model, post: post, }));
        // authorise soft-delete
        ctx.authorize(
          ctx.services.blogPostCommentPolicy.canSoftDelete({ model, post: post, }),
          BlogPostCommentLang.CannotSoftDelete({ model, }),
        );
        // do soft-delete
        await ctx.services.blogPostCommentService.softDelete({ runner, author, model, post: post });
        return model;
      });
      return model;
    },
  },

  /**
   * HardDelete a BlogPostComment
   */
  hardDeleteBlogPostComment: {
    type: GraphQLNonNull(BlogPostCommentGqlNode),
    args: { dto: { type: GraphQLNonNull(TargetBlogPostCommentGqlInput) } },
    resolve: async (parent, args, ctx): Promise<IBlogPostCommentGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.blogPostCommentPolicy.canAccess(), BlogPostCommentLang.CannotAccess);
      // validate
      const dto = ctx.validate(TargetBlogPostCommentValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const model: BlogPostCommentModel = await ctx.services.blogPostCommentRepository.findByPkOrfail(dto.id, {
          runner,
          options: { include: [
              { association: BlogPostCommentAssociation.author, },
              { association: BlogPostCommentAssociation.post, },
          ] },
        });
        const author: UserModel = assertDefined(model.author);
        const post: BlogPostModel = assertDefined(model.post);
        // authorise view
        ctx.services.blogPostCommentRepository._404Unless(ctx.services.blogPostCommentPolicy.canFindOne({ model, post, }));
        // authorise hard-delete
        ctx.authorize(
          ctx.services.blogPostCommentPolicy.canHardDelete({ model, post, }),
          BlogPostCommentLang.CannotHardDelete({ model, }),
        );
        // do hard-delete
        await ctx.services.blogPostCommentService.hardDelete({ runner, author, model, post });
        return model;
      });
      return final;
    },
  },

  /**
   * Restore a BlogPostComment
   */
  restoreBlogPostComment: {
    type: GraphQLNonNull(BlogPostCommentGqlNode),
    args: { dto: { type: GraphQLNonNull(TargetBlogPostCommentGqlInput) } },
    resolve: async (parent, args, ctx): Promise<IBlogPostCommentGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.blogPostCommentPolicy.canAccess(), BlogPostCommentLang.CannotAccess);
      // validate
      const dto = ctx.validate(TargetBlogPostCommentValidator, args.dto);
      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        // find
        const model: BlogPostCommentModel = await ctx.services.blogPostCommentRepository.findByPkOrfail(dto.id, {
          runner,
          options: { include: [
              { association: BlogPostCommentAssociation.author, },
              { association: BlogPostCommentAssociation.post, },
          ] },
        });
        const author: UserModel = assertDefined(model.author);
        const post: BlogPostModel = assertDefined(model.post);
        // authorise view
        ctx.services.blogPostCommentRepository._404Unless(ctx.services.blogPostCommentPolicy.canFindOne({ model, post, }));
        // authorise restore
        ctx.authorize(
          ctx.services.blogPostCommentPolicy.canRestore({ model, post, }),
          BlogPostCommentLang.CannotRestore({ model, }),
        );
        // do restore
        await ctx.services.blogPostCommentService.restore({ runner, author, model, post, });
        return model;
      });
      return final;
    },
  },
});