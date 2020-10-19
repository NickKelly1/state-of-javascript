import { Router } from 'express';
import { ExpressContext } from '../../common/classes/express-context';
import { NotFoundException } from '../../common/exceptions/types/not-found.exception';
import { mw } from '../../common/helpers/mw.helper';
import { HttpCode } from '../../common/constants/http-code.const';
import { PermissionLang } from '../../common/i18n/packs/permission.lang';
import { IPaginateInput } from '../../common/interfaces/pageinate-input.interface';
import { apiCollection } from '../../common/responses/api-collection';
import { apiResource } from '../../common/responses/api-resource';
import { PermissionModel } from '../../circle';
import { orFail } from '../../common/helpers/or-fail.helper';
import { JsonResponder } from '../../common/responses/json.responder';
import { IApiResource } from '../../common/interfaces/api-resource.interface';
import { IPermissionRo } from './dtos/permission.ro';
import { IApiCollection } from '../../common/interfaces/api-collection.interface';
import { logger } from '../../common/logger/logger';
import { pretty, prettyQ } from '../../common/helpers/pretty.helper';


export function PermissionRoutes(arg: { app: ExpressContext }): Router {
  const { app } = arg;
  const router = Router();

  // findMany
  router.get(
    '/',
    mw<JsonResponder<IApiCollection<IPermissionRo>>>(async (ctx) => {
      const { req, res } = ctx;
      ctx.authorize(await ctx.services.permissionPolicy().canFindMany({ ctx }));
      const { page, findOptions } = ctx.findQuery();
      const [models, total] = await ctx.services.dbService().transact(async ({ runner }) => {
        const { transaction } = runner;
        const { rows, count } = await PermissionModel.findAndCountAll({ transaction, ...findOptions });
        return [rows, count];
      });

      const collection = apiCollection({
        total,
        page,
        data: models.map(model => ctx.services.permissionService().toRo({ model })),
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
      ctx.authorize(await ctx.services.permissionPolicy().canFindMany({ ctx }));

      const model = await ctx.services.dbService().transact(async ({ runner }) => {
        const { transaction } = runner;
        const model = await PermissionModel
          .findByPk(id, { transaction })
          .then(orFail(() => ctx.except(NotFoundException({
            message: ctx.lang(PermissionLang.NotFound),
          }))));
        return model;
      });

      ctx.authorize(await ctx.services.permissionPolicy().canFindOne({ ctx, model }));

      const resource = apiResource({ data: ctx.services.permissionService().toRo({ model }) });
      return new JsonResponder(HttpCode.OK, resource);
    }),
  );


  return router;
}