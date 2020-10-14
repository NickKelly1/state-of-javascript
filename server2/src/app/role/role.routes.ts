import { Router } from 'express';
import { isLeft } from 'fp-ts/lib/These';
import Joi, { ValidationError } from 'joi';
import { CreateRoleDto, ICreateRoleDto } from './dtos/create-role.dto';
import { BadRequestException } from '../../common/exceptions/types/bad-request.exception';
import { ExpressContext } from '../../common/classes/express-context';
import { NotFoundException } from '../../common/exceptions/types/not-found.exception';
import { is } from '../../common/helpers/is.helper';
import { mw } from '../../common/helpers/mw.helper';
import { HttpCode } from '../../common/constants/http-code.const';
import { RoleLang } from '../../common/i18n/packs/role.lang';
import { validate } from '../../common/helpers/validate.helper';
import { ExceptionLang } from '../../common/i18n/packs/exception.lang';
import { IPaginateInput } from '../../common/interfaces/pageinate-input.interface';
import { apiCollection } from '../../common/responses/api-collection';
import { pretty } from '../../common/helpers/pretty.helper';
import { apiResource } from '../../common/responses/api-resource';
import { logger } from '../../common/logger/logger';
import { RoleModel } from '../../circle';
import { RoleField } from './role.attributes';
import { orFail } from '../../common/helpers/or-fail.helper';



export function RoleRoutes(arg: { app: ExpressContext }): Router {
  const { app } = arg;
  const router = Router();

  // findMany
  router.get('/', mw(async (ctx) => {
    const { req, res } = ctx;
    const page: IPaginateInput = { offset: 0, limit: 15 };
    const { offset, limit } = page;
    ctx.authorize(await ctx.services.rolePolicy().canFindMany({ ctx }));

    const [models, total] = await ctx.services.dbService().transact(async ({ runner }) => {
      const { transaction } = runner;
      const { rows, count } = await RoleModel.findAndCountAll({ transaction, limit, offset });
      return [rows, count];
    });

    const collection = apiCollection({
      total,
      page,
      data: models.map(model => ctx.services.roleService().toRo({ model })),
    });

    res.status(HttpCode.OK).json(collection);
  }));


  // findOne
  router.get('/:id', mw(async (ctx) => {
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
    res.status(HttpCode.OK).json(resource);
  }));


  // create
  router.post('/', mw(async (ctx) => {
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
    res.status(HttpCode.OK).json(resource);
  }));

  return router;
}