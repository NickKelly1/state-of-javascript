import {
  GraphQLBoolean,
  GraphQLFieldConfigMap,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
  Thunk,
} from "graphql";
import { BlogPostModel, UserModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { BlogPostLang } from "../blog-post.lang";
import { BlogPostAssociation } from "../blog-post.associations";
import { IBlogPostGqlNodeSource, BlogPostGqlNode } from "./blog-post.gql.node";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import Joi from "joi";
import { BlogPostDefinition } from "../blog-post.definition";
import { OrNullable } from "../../../common/types/or-nullable.type";
import { IBlogPostServiceCreateBlogPostDto } from "../blog-post.service";
import tempy from "tempy";
import mime from "mime-types";
import { BadRequestException } from "../../../common/exceptions/types/bad-request.exception";
import { FileLang } from "../../file/file.lang";
import { filenameify, randomFileName } from "../../../common/helpers/filenameify.helper";
import fs from 'fs';
import path from 'path';
import { logger } from "../../../common/logger/logger";

// --------
// create
// --------

export interface ICreateBlogPostInput {
  title: string;
  teaser: string;
  body: string;
  image: Promise<FileUpload>;
}

export const CreateBlogPostGqlInput = new GraphQLInputObjectType({
  name: 'CreateBlogPost',
  fields: () => ({
    title: { type: GraphQLNonNull(GraphQLString), },
    teaser: { type: GraphQLNonNull(GraphQLString), },
    body: { type: GraphQLNonNull(GraphQLString), },
    image: { type: GraphQLNonNull(GraphQLUpload), },
  }),
})

export const CreateBlogPostValidator = Joi.object<ICreateBlogPostInput>({
  title: Joi.string().min(BlogPostDefinition.title.min).max(BlogPostDefinition.title.max).required(),
  teaser: Joi.string().min(BlogPostDefinition.teaser.min).max(BlogPostDefinition.teaser.max).required(),
  body: Joi.string().min(BlogPostDefinition.body.min).max(BlogPostDefinition.body.max).required(),
  image: Joi.object().required(),
});

// --------
// update
// --------

export interface IUpdateBlogPostInput {
  id: number;
  title?: OrNullable<string>;
  teaser?: OrNullable<string>;
  body?: OrNullable<string>;
  image?: OrNullable<Promise<FileUpload>>;
}

export const UpdateBlogPostGqlInput = new GraphQLInputObjectType({
  name: 'UpdateBlogPost',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    title: { type: GraphQLString, },
    teaser: { type: GraphQLString, },
    body: { type: GraphQLString, },
    image: { type: GraphQLUpload, },
  }),
})

export const UpdateBlogPostValidator = Joi.object<IUpdateBlogPostInput>({
  id: Joi.number().integer().positive().required(),
  title: Joi.string().min(BlogPostDefinition.title.min).max(BlogPostDefinition.title.max).optional(),
  teaser: Joi.string().min(BlogPostDefinition.teaser.min).max(BlogPostDefinition.teaser.max).optional(),
  body: Joi.string().min(BlogPostDefinition.body.min).max(BlogPostDefinition.body.max).optional(),
  image: Joi.object().optional(),
});

// --------
// target
// --------

export interface ITargetBlogPostInput {
  id: number;
}

export const TargetBlogPostGqlInput = new GraphQLInputObjectType({
  name: 'TargetBlogPost',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
  }),
})

export const TargetBlogPostValidator = Joi.object<ITargetBlogPostInput>({
  id: Joi.number().integer().positive().required(),
});

// --------
// mutations
// --------

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
      // extract image
      const upload = await (args.dto as ICreateBlogPostInput).image;

      // prep the image file
      const extension = mime.extension(upload.mimetype);
      if (!extension) {
        const msg = ctx.lang(FileLang.NoExtensionForMimtype({ mimetype: upload.mimetype }));
        throw new BadRequestException(msg);
      }
      const imageFile = tempy.file({ extension });
      const imageTitle = path.basename(upload.filename, path.extname(upload.filename));
      // write the image file to temp a directory
      const imageWriter = upload.createReadStream().pipe(fs.createWriteStream(imageFile));
      await new Promise((res, rej) => imageWriter.once('error', rej).once('finish', res));

      const final = await ctx.services.universal.db.transact(async ({ runner }) => {
        const author = await ctx.services.userRepository.findByPkOrfail(author_id, { runner, unscoped: true });

        const svcDto: IBlogPostServiceCreateBlogPostDto = {
          image: {
            encoding: upload.encoding,
            mimetype: upload.encoding,
            extension,
            file: imageFile,
            title: imageTitle,
          },
          body: dto.body,
          teaser: dto.teaser,
          title: dto.title,
        };

        // create the blog post and image
        const model = await ctx
          .services
          .blogPostService
          .create({ runner, author, dto: svcDto });

        return model;
      });

      return ctx.services.blogPostRepository.fresh({ model: final }).then(assertDefined);
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

      return ctx.services.blogPostRepository.fresh({ model: final }).then(assertDefined);
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

      return ctx.services.blogPostRepository.fresh({ model: final }).then(assertDefined);
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

      return ctx.services.blogPostRepository.fresh({ model: final }).then(assertDefined);
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

      return ctx.services.blogPostRepository.fresh({ model: final }).then(assertDefined);
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

      return ctx.services.blogPostRepository.fresh({ model: final }).then(assertDefined);
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

      return ctx.services.blogPostRepository.fresh({ model: final }).then(assertDefined);
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

      return ctx.services.blogPostRepository.fresh({ model: final }).then(assertDefined);
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

      return ctx.services.blogPostRepository.fresh({ model: final }).then(assertDefined);
    },
  },
});