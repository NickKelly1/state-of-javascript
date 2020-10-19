import { Router } from 'express';
import { ExpressContext } from '../../common/classes/express-context';
import { mw } from '../../common/helpers/mw.helper';
import { HttpCode } from '../../common/constants/http-code.const';
import { apiCollection } from '../../common/responses/api-collection';
import { apiResource } from '../../common/responses/api-resource';
import { PermissionModel } from '../../circle';
import { JsonResponder } from '../../common/responses/json.responder';
import { IApiResource } from '../../common/interfaces/api-resource.interface';
import { IPermissionRo } from './dtos/permission.ro';
import { IApiCollection } from '../../common/interfaces/api-collection.interface';
import { OrNull } from '../../common/types/or-null.type';


export function PermissionRoutes(arg: { app: ExpressContext }): Router {
  const router = Router();

  // findMany
  router.get(
    '/',
    mw<JsonResponder<IApiCollection<OrNull<IPermissionRo>>>>(async (ctx) => {
      const { req, res } = ctx;
      ctx.authorize(ctx.services.permissionPolicy().canFindMany());
      const { page, options: findOptions } = ctx.findQuery();
      const [models, total] = await ctx.services.dbService().transact(async ({ runner }) => {
        const { transaction } = runner;
        const { rows, count } = await PermissionModel.findAndCountAll({ transaction, ...findOptions });
        return [rows, count];
      });

      const collection = apiCollection({
        total,
        page,
        data: models.map(model =>
          ctx.services.permissionPolicy().canFindOne({ model })
            ? ctx.services.permissionService().toRo({ model })
            : null
        ),
      });

      return new JsonResponder(HttpCode.OK, collection);
    }),
  );


  // findOne
  router.get(
    '/:id',
    mw<JsonResponder<IApiResource<IPermissionRo>>>(async (ctx) => {
      const id = ctx.req.params.id;
      const { res } = ctx;
      ctx.authorize(ctx.services.permissionPolicy().canFindMany());

      const model = await ctx.services.dbService().transact(async ({ runner }) => {
        const model = await ctx.services.permissionRepository().findByPkOrfail(id, { runner });
        return model;
      });

      ctx.authorize(ctx.services.permissionPolicy().canFindOne({ model }));
      const resource = apiResource({ data: ctx.services.permissionService().toRo({ model }) });
      return new JsonResponder(HttpCode.OK, resource);
    }),
  );


  return router;
}