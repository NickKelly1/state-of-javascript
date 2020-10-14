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


export function PermissionRoutes(arg: { app: ExpressContext }): Router {
  const { app } = arg;
  const router = Router();

  // findMany
  router.get('/', mw(async (ctx) => {
    const { req, res } = ctx;
    const page: IPaginateInput = { offset: 0, limit: 15 };
    const { offset, limit } = page;
    ctx.authorize(await ctx.services.permissionPolicy().canFindMany({ ctx }));

    const [models, total] = await ctx.services.dbService().transact(async ({ runner }) => {
      const { transaction } = runner;
      const { rows, count } = await PermissionModel.findAndCountAll({ transaction, limit, offset });
      return [rows, count];
    });

    const collection = apiCollection({
      total,
      page,
      data: models.map(model => ctx.services.permissionService().toRo({ model })),
    });

    res.status(HttpCode.OK).json(collection);
  }));


  // findOne
  router.get('/:id', mw(async (ctx) => {
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
    res.status(HttpCode.OK).json(resource);
  }));


  return router;
}