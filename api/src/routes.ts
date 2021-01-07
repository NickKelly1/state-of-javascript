import { Router, Express } from 'express';
import { IUniversalServices } from './common/interfaces/universal.services.interface';
import { BlogPostRoutes } from './app/blog-post/blog-post.routes';

export function Routes(arg: { universal: IUniversalServices }): Router {
  const { universal } = arg;
  const router = Router();
  router.use('/blog-posts', BlogPostRoutes({ universal, }))
  return router;
}
