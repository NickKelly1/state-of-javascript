import { Router } from 'express';
import { CreateUserDto, } from './dtos/create-user.dto';
import { ExpressContext } from '../../common/classes/express-context';
import { mw } from '../../common/helpers/mw.helper';
import { HttpCode } from '../../common/constants/http-code.const';
import { apiCollection } from '../../common/responses/api-collection';
import { pretty, } from '../../common/helpers/pretty.helper';
import { apiResource } from '../../common/responses/api-resource';
import { logger } from '../../common/logger/logger';
import { JsonResponder } from '../../common/responses/json.responder';
import { IApiCollection } from '../../common/interfaces/api-collection.interface';
import { IUserRo } from './dtos/user.ro';
import { IApiResource } from '../../common/interfaces/api-resource.interface';
import { OrNull } from '../../common/types/or-null.type';





export function UserRoutes(arg: { app: ExpressContext }): Router {
  const router = Router();

  // findMany
  router.get(
    '/',
    mw<JsonResponder<IApiCollection<OrNull<IUserRo>>>>(async (ctx) => {
      ctx.authorize(ctx.services.userPolicy().canFindMany());
      const { page, options } = ctx.findQuery();
      const [models, total] = await ctx.services.dbService().transact(async ({ runner }) => {
        const { rows, count } = await ctx.services.userRepository().findAllAndCount({ runner, options });
        return [rows, count];
      });

      const collection = apiCollection({
        total,
        page,
        data: models.map((model) => 
          ctx.services.userPolicy().canFindOne({ model })
            ? ctx.services.userService().toRo({ model })
            : null
        ),
      });

      return new JsonResponder(HttpCode.OK, collection);
    }),
  );


  // findOne
  router.get(
    '/:id',
    mw<JsonResponder<IApiResource<IUserRo>>>(async (ctx) => {
      const id = ctx.req.params.id;
      ctx.authorize(ctx.services.userPolicy().canFindMany());

      const model = await ctx.services.dbService().transact(async ({ runner }) => {
        const model = await ctx.services.userRepository().findByPkOrfail(id, { runner });
        return model;
      });

      ctx.authorize(ctx.services.userPolicy().canFindOne({ model }));
      const resource = apiResource({ data: ctx.services.userService().toRo({ model }) });
      return new JsonResponder(HttpCode.OK, resource);
    }),
  );


  // create
  router.post(
    '/',
    mw<JsonResponder<IApiResource<IUserRo>>>(async (ctx) => {
      ctx.authorize(ctx.services.userPolicy().canCreate());
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