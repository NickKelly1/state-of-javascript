import { Router } from 'express';
import { CreateUserRoleDto } from './dtos/create-user-role.dto';
import { BadRequestException } from '../../common/exceptions/types/bad-request.exception';
import { ExpressContext } from '../../common/classes/express-context';
import { NotFoundException } from '../../common/exceptions/types/not-found.exception';
import { mw } from '../../common/helpers/mw.helper';
import { HttpCode } from '../../common/constants/http-code.const';
import { IPaginateInput } from '../../common/interfaces/pageinate-input.interface';
import { apiCollection } from '../../common/responses/api-collection';
import { pretty, prettyQ } from '../../common/helpers/pretty.helper';
import { apiResource } from '../../common/responses/api-resource';
import { logger } from '../../common/logger/logger';
import { RoleModel, UserModel, UserRoleModel } from '../../circle';
import { UserRoleField } from './user-role.attributes';
import { orFail } from '../../common/helpers/or-fail.helper';
import { UserLang } from '../../common/i18n/packs/user.lang';
import { RoleLang } from '../../common/i18n/packs/role.lang';
import { JsonResponder } from '../../common/responses/json.responder';
import { IApiResource } from '../../common/interfaces/api-resource.interface';
import { UserRoleService } from './user-role.service';
import { IUserRoleRo } from './dtos/user-role.ro';
import { IApiCollection } from '../../common/interfaces/api-collection.interface';
import { Op, WhereOperators, WhereOptions } from 'sequelize';
import { OrNull } from '../../common/types/or-null.type';



export function UserRoleRoutes(arg: { app: ExpressContext }): Router {
  const router = Router();

  // findMany
  router.get(
    '/',
    mw<JsonResponder<IApiCollection<OrNull<IUserRoleRo>>>>(async (ctx) => {
      ctx.authorize(ctx.services.userRolePolicy().canFindMany());
      const { page, options } = ctx.findQuery();
      const [models, total] = await ctx.services.dbService().transact(async ({ runner }) => {
        const { rows, count } = await ctx.services.userRoleRepository().findAllAndCount({ runner, options });
        return [rows, count];
      });

      const collection = apiCollection({
        total,
        page,
        data: models.map(model =>
          ctx.services.userRolePolicy().canFindOne({ model })
            ? ctx.services.userRoleService().toRo({ model })
            : null,
        ),
      });

      return new JsonResponder(HttpCode.OK, collection);
    }),
  );


  // findOne
  router.get(
    '/:id',
    mw<JsonResponder<IApiResource<IUserRoleRo>>>(async (ctx) => {
      const id = ctx.req.params.id;
      ctx.authorize(ctx.services.userRolePolicy().canFindMany());

      const model = await ctx.services.dbService().transact(async ({ runner }) => {
        const { transaction } = runner;
        const model = await UserRoleModel
          .findByPk(id, { transaction })
          .then(orFail(() => ctx.except(NotFoundException())));
        return model;
      });

      ctx.authorize(ctx.services.userRolePolicy().canFindOne({ model }));
      const resource = apiResource({ data: ctx.services.userRoleService().toRo({ model }) });
      return new JsonResponder(HttpCode.OK, resource);
    }),
  );


  // create
  router.post(
    '/',
    mw<JsonResponder<IApiResource<IUserRoleRo>>>(async (ctx) => {
      ctx.authorize(ctx.services.userRolePolicy().canCreate());
      const dto = ctx.body(CreateUserRoleDto);

      const model = await ctx.services.dbService().transact(async ({ runner }) => {
        const { transaction } = runner;
        const [user, role] = await Promise.all([
          ctx.services.userRepository().findByPkOrfail(dto.user_id, { runner }),
          ctx.services.roleRepository().findByPkOrfail(dto.role_id, { runner }),
        ]);
        const model = await ctx.services.userRoleService().create({ runner, role, user });
        await model.reload({ transaction });
        return model;
      });

      logger.info(`UserRole created: ${pretty(model)}`);
      const resource = apiResource({ data: ctx.services.userRoleService().toRo({ model }) }) ;
      return new JsonResponder(HttpCode.CREATED, resource);
    }),
  );

  return router;
}