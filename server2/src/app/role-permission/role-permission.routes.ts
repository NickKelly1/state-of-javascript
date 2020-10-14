import { Router } from 'express';
import { CreateRolePermissionDto } from './dtos/create-role-permission.dto';
import { BadRequestException } from '../../common/exceptions/types/bad-request.exception';
import { ExpressContext } from '../../common/classes/express-context';
import { NotFoundException } from '../../common/exceptions/types/not-found.exception';
import { mw } from '../../common/helpers/mw.helper';
import { HttpCode } from '../../common/constants/http-code.const';
import { IPaginateInput } from '../../common/interfaces/pageinate-input.interface';
import { apiCollection } from '../../common/responses/api-collection';
import { pretty } from '../../common/helpers/pretty.helper';
import { apiResource } from '../../common/responses/api-resource';
import { logger } from '../../common/logger/logger';
import { RolePermissionModel } from '../../circle';
import { RolePermissionField } from './role-permission.attributes';
import { orFail } from '../../common/helpers/or-fail.helper';
import { RoleModel } from '../role/role.model';
import { RoleLang } from '../../common/i18n/packs/role.lang';
import { PermissionModel } from '../permission/permission.model';
import { PermissionLang } from '../../common/i18n/packs/permission.lang';



export function RolePermissionRoutes(arg: { app: ExpressContext }): Router {
  const { app } = arg;
  const router = Router();

  // findMany
  router.get('/', mw(async (ctx) => {
    const { req, res } = ctx;
    const page: IPaginateInput = { offset: 0, limit: 15 };
    const { offset, limit } = page;
    ctx.authorize(await ctx.services.rolePermissionPolicy().canFindMany({ ctx }));

    const [models, total] = await ctx.services.dbService().transact(async ({ runner }) => {
      const { transaction } = runner;
      const { rows, count } = await RolePermissionModel.findAndCountAll({ transaction, limit, offset });
      return [rows, count];
    });

    const collection = apiCollection({
      total,
      page,
      data: models.map(model => ctx.services.rolePermissionService().toRo({ model })),
    });

    res.status(HttpCode.OK).json(collection);
  }));


  // findOne
  router.get('/:id', mw(async (ctx) => {
    const id = ctx.req.params.id;
    const { res } = ctx;
    ctx.authorize(await ctx.services.rolePermissionPolicy().canFindMany({ ctx }));

    const model = await ctx.services.dbService().transact(async ({ runner }) => {
      const { transaction } = runner;
      const model = await RolePermissionModel
        .findByPk(id, { transaction })
        .then(orFail(() => ctx.except(NotFoundException())));
      return model;
    });

    ctx.authorize(await ctx.services.rolePermissionPolicy().canFindOne({ ctx, model }));

    const resource = apiResource({ data: ctx.services.rolePermissionService().toRo({ model }) });
    res.status(HttpCode.OK).json(resource);
  }));


  // create
  router.post('/', mw(async (ctx) => {
    const { res } = ctx;

    ctx.authorize(await ctx.services.rolePermissionPolicy().canCreate({ ctx }));
    const dto = ctx.body(CreateRolePermissionDto);

    const model = await ctx.services.dbService().transact(async ({ runner }) => {
      const { transaction } = runner;
      const [role, permission] = await Promise.all([
        RoleModel
          .findByPk(dto.role_id)
          .then(orFail(() => ctx.except(BadRequestException({
            data: {[RolePermissionField.permission_id]: [ctx.lang(RoleLang.NotFound)] },
          })))),
        PermissionModel
          .findByPk(dto.permission_id)
          .then(orFail(() => ctx.except(BadRequestException({
            data: {[RolePermissionField.permission_id]: [ctx.lang(PermissionLang.NotFound)] },
          })))),
      ]);
      const model = await ctx.services.rolePermissionService().create({ runner, role, permission });
      await model.reload({ transaction });
      return model;
    });

    logger.info(`RolePermission created: ${pretty(model)}`);
    const resource = apiResource({ data: ctx.services.rolePermissionService().toRo({ model }) }) ;
    res.status(HttpCode.OK).json(resource);
  }));

  return router;
}