import { Router } from 'express';
import { isLeft } from 'fp-ts/lib/These';
import Joi, { ValidationError, ObjectSchema } from 'joi';
import { CreateUserDto, ICreateUserDto } from './dtos/create-user.dto';
import { BadRequestException } from '../../common/exceptions/types/bad-request.exception';
import { ExpressContext } from '../../common/classes/express-context';
import { NotFoundException } from '../../common/exceptions/types/not-found.exception';
import { ist } from '../../common/helpers/is.helper';
import { mw } from '../../common/helpers/mw.helper';
import { HttpCode } from '../../common/constants/http-code.const';
import { UserLang } from '../../common/i18n/packs/user.lang';
import { validate } from '../../common/helpers/validate.helper';
import { ExceptionLang } from '../../common/i18n/packs/exception.lang';
import { IPaginateInput } from '../../common/interfaces/pageinate-input.interface';
import { apiCollection } from '../../common/responses/api-collection';
import { pretty, prettyQ } from '../../common/helpers/pretty.helper';
import { apiResource } from '../../common/responses/api-resource';
import { logger } from '../../common/logger/logger';
import { RoleModel, UserModel } from '../../circle';
import { UserField } from './user.attributes';
import { orFail } from '../../common/helpers/or-fail.helper';
import { JsonResponder } from '../../common/responses/json.responder';
import { IApiCollection } from '../../common/interfaces/api-collection.interface';
import { IUserRo } from './dtos/user.ro';
import { IApiResource } from '../../common/interfaces/api-resource.interface';
import { Op } from 'sequelize';
import { OrUndefined } from '../../common/types/or-undefined.type';
import { Primitive } from '../../common/types/primitive.type';
import { K2K } from '../../common/types/k2k.type';
import { IUserRoleRo } from '../user-role/dtos/user-role.ro';
import { IRoleRo } from '../role/dtos/role.ro';





export function UserRoutes(arg: { app: ExpressContext }): Router {
  const { app } = arg;
  const router = Router();

  // findMany
  router.get(
    '/',
    mw<JsonResponder<IApiCollection<IUserRo>>>(async (ctx) => {
      const { req, res } = ctx;
      ctx.authorize(await ctx.services.userPolicy().canFindMany({ ctx }));
      const { page, findOptions } = ctx.findQuery();
      const [models, total] = await ctx.services.dbService().transact(async ({ runner }) => {
        const { transaction } = runner;
        const { rows, count } = await UserModel.findAndCountAll({ transaction, ...findOptions, });
        return [rows, count];
      });

      const collection = apiCollection({
        total,
        page,
        data: models.map(model => ctx.services.userService().toRo({ model })),
      });

      return new JsonResponder(HttpCode.OK, collection);
    }),
  );


  // findOne
  router.get(
    '/:id',
    mw<JsonResponder<IApiResource<IUserRo>>>(async (ctx) => {
      const id = ctx.req.params.id;
      const { res } = ctx;
      ctx.authorize(await ctx.services.userPolicy().canFindMany({ ctx }));

      const model = await ctx.services.dbService().transact(async ({ runner }) => {
        const { transaction } = runner;
        const model = await UserModel
          .findByPk(id, { transaction })
          .then(orFail(() => ctx.except(NotFoundException({
            message: ctx.lang(UserLang.NotFound),
          }))));
        return model;
      });

      ctx.authorize(await ctx.services.userPolicy().canFindOne({ ctx, model }));

      const resource = apiResource({ data: ctx.services.userService().toRo({ model }) });
      return new JsonResponder(HttpCode.OK, resource);
    }),
  );

  // // findOne users roles
  // router.get(
  //   '/:id/roles',
  //   mw<JsonResponder<IApiCollection<IRoleRo>>>(async (ctx) => {
  //     const id = ctx.req.params.id;
  //     ctx.authorize(await ctx.services.rolePolicy().canFindMany({ ctx }));
  //     const { page, findOptions } = ctx.findQuery();
  //     logger.info(`user roles query: ${pretty({ page, findOptions })}`);

  //     const [models, total] = await ctx.services.dbService().transact(async ({ runner }) => {
  //       const { transaction } = runner;
  //       const { rows, count } = await RoleModel.findAndCountAll({
  //         transaction,
  //         ...findOptions,
  //       });
  //       return [rows, count];
  //     });

  //     const collection = apiCollection({
  //       total,
  //       page,
  //       data: models.map(model => ctx.services.roleService().toRo({ model })),
  //     });

  //     return new JsonResponder(HttpCode.OK, collection);
  //   }),
  // );


  // create
  router.post(
    '/',
    mw<JsonResponder<IApiResource<IUserRo>>>(async (ctx) => {
      const { req, res } = ctx;

      ctx.authorize(await ctx.services.userPolicy().canCreate({ ctx }));
      const dto = ctx.body(CreateUserDto);

      const model = await ctx.services.dbService().transact(async ({ runner }) => {
        const { transaction } = runner;
        const model = await ctx.services.userService().create({ runner, dto });
        await model.reload({ transaction });
        return model;
      });

      logger.info(`User created: ${pretty(model)}`);
      const resource = apiResource({ data: ctx.services.userService().toRo({ model }) }) ;
      return new JsonResponder(HttpCode.CREATED, resource);
    }),
  );

  return router;
}