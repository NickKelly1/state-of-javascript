import { Router } from "express";
import { NotFoundException } from "../../common/exceptions/types/not-found.exception";
import { IMwFn, mw } from "../../common/helpers/mw.helper";
import { ExceptionLang } from "../../common/i18n/packs/exception.lang";
import { IUniversalServices } from "../../common/interfaces/universal.services.interface";
import { ImageAssociation } from "../image/image.associations";
import { BlogPostAssociation } from "./blog-post.associations";
import { BlogPostLang } from "./blog-post.lang";
import fs from 'fs';
import path from 'path';
import { logger } from "../../common/logger/logger";
import { prettyQ } from "../../common/helpers/pretty.helper";

enum ImageType {
  Original,
  Thumbnail,
  Display,
}

/**
 * Respond with a blog-post-image
 */
const blogPostImageResponse = (type: ImageType): IMwFn => async (ctx, next) => {
  const { req, res, } = ctx;

  // id
  const id = req.params.id;

  // check access
  ctx.authorize(ctx.services.blogPostPolicy.canAccess(), BlogPostLang.CannotAccess);

  // check find-many
  ctx.authorize(ctx.services.blogPostPolicy.canFindMany(), BlogPostLang.CannotFindMany);

  // find model
  const model = await ctx.services.blogPostRepository.findByPkOrfail(id, {
    runner: null,
    options: {
      include: {
        association: BlogPostAssociation.image,
        include: [{
          association: type === ImageType.Thumbnail ? ImageAssociation.thumbnail
            : type === ImageType.Original ? ImageAssociation.original
            : ImageAssociation.display
        }]
      }
    }
  });

  // check model access
  ctx.services.blogPostRepository._404Unless(ctx.services.blogPostPolicy.canFindOne({ model }));

  // image
  const image = model.image;
  if (!image) throw new NotFoundException(ctx.lang(ExceptionLang.NotFound));

  // file
  const file = type === ImageType.Thumbnail ? image.thumbnail
    : type === ImageType.Original ? image.original
    : image.display
  if (!file) throw new NotFoundException(ctx.lang(ExceptionLang.NotFound));

  // pipe file
  fs
    .createReadStream(path.join(ctx.services.universal.env.UPLOADS_DIR, `./${file.filename}`))
    .pipe(res
      .header('content-type', file.mimetype)
      .status(200))
    .once('error', (error) => {
      logger.error(`Failed to read file: ${prettyQ(error)}`);
      next(error);
    });
}


/**
 * Blog Post Routes
 */
export function BlogPostRoutes(arg: { universal: IUniversalServices }): Router {
  const { universal } = arg;
  const router = Router();

  router.get('/:id/original', mw(blogPostImageResponse(ImageType.Original)))
  router.get('/:id/thumbnail', mw(blogPostImageResponse(ImageType.Thumbnail)))
  router.get('/:id/display', mw(blogPostImageResponse(ImageType.Display)))

  return router;
}