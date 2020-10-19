import { Router } from 'express';
import { CreateRoleDto } from './dtos/create-role.dto';
import { ExpressContext } from '../../common/classes/express-context';
import { NotFoundException } from '../../common/exceptions/types/not-found.exception';
import { mw } from '../../common/helpers/mw.helper';
import { HttpCode } from '../../common/constants/http-code.const';
import { RoleLang } from '../../common/i18n/packs/role.lang';
import { IPaginateInput } from '../../common/interfaces/pageinate-input.interface';
import { apiCollection } from '../../common/responses/api-collection';
import { pretty, prettyQ } from '../../common/helpers/pretty.helper';
import { apiResource } from '../../common/responses/api-resource';
import { logger } from '../../common/logger/logger';
import { RoleModel } from '../../circle';
import { orFail } from '../../common/helpers/or-fail.helper';
import { JsonResponder } from '../../common/responses/json.responder';
import { IApiResource } from '../../common/interfaces/api-resource.interface';
import { IRoleRo } from './dtos/role.ro';
import { IApiCollection } from '../../common/interfaces/api-collection.interface';



export function RoleRoutes(arg: { app: ExpressContext }): Router {
  const { app } = arg;
  const router = Router();

  // findMany
  router.get(
    '/',
    mw<JsonResponder<IApiCollection<IRoleRo>>>(async (ctx) => {
      ctx.authorize(await ctx.services.rolePolicy().canFindMany({ ctx }));
      const { page, findOptions } = ctx.findQuery();
      const [models, total] = await ctx.services.dbService().transact(async ({ runner }) => {
        const { transaction } = runner;
        const { rows, count } = await RoleModel.findAndCountAll({ transaction, ...findOptions });
        return [rows, count];
      });

      const collection = apiCollection({
        total,
        page,
        data: models.map(model => ctx.services.roleService().toRo({ model })),
      });

      return new JsonResponder(HttpCode.OK, collection);
    }),
  );


  // findOne
  router.get(
    '/:id',
    mw<JsonResponder<IApiResource<IRoleRo>>>(async (ctx) => {
      const id = ctx.req.params.id;
      const { res } = ctx;
      ctx.authorize(await ctx.services.rolePolicy().canFindMany({ ctx }));

      const model = await ctx.services.dbService().transact(async ({ runner }) => {
        const { transaction } = runner;
        const model = await RoleModel
          .findByPk(id, { transaction })
          .then(orFail(() => ctx.except(NotFoundException({
            message: ctx.lang(RoleLang.NotFound),
          }))));
        return model;
      });

      ctx.authorize(await ctx.services.rolePolicy().canFindOne({ ctx, model }));

      const resource = apiResource({ data: ctx.services.roleService().toRo({ model }) });
      return new JsonResponder(HttpCode.OK, resource);
    }),
  );


  // create
  router.post(
    '/',
    mw<JsonResponder<IApiResource<IRoleRo>>>(async (ctx) => {
      const { req, res } = ctx;

      ctx.authorize(await ctx.services.rolePolicy().canCreate({ ctx }));
      const dto = ctx.body(CreateRoleDto);

      const model = await ctx.services.dbService().transact(async ({ runner }) => {
        const { transaction } = runner;
        const model = await ctx.services.roleService().create({ runner, dto });
        await model.reload({ transaction });
        return model;
      });

      logger.info(`Role created: ${pretty(model)}`);
      const resource = apiResource({ data: ctx.services.roleService().toRo({ model }) }) ;
      return new JsonResponder(HttpCode.OK, resource);
    }),
  );

  return router;
}