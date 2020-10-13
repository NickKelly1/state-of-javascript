import { Router } from 'express';
import { isLeft } from 'fp-ts/lib/These';
import Joi, { ValidationError } from 'joi';
import { CreateUserDto, ICreateUserDto } from './dtos/create-user.dto';
import { UserModel } from './user.model';
import { BadRequestException } from '../../common/exceptions/types/bad-request.exception';
import { ExpressContext } from '../../common/classes/express-context';
import { QueryRunner } from '../../common/classes/query-runner';
import { NotFoundException } from '../../common/exceptions/types/not-found.exception';
import { is } from '../../common/helpers/is.helper';
import { mw } from '../../common/helpers/mw.helper';
import { HttpCode } from '../../common/constants/http-code.const';
import { Dbg } from '../../dbg';
import { UserLang } from '../../common/i18n/packs/user.lang';
import { validate } from '../../common/helpers/validate.helper';
import { ExceptionLang } from '../../common/i18n/packs/exception.lang';
import { IPaginateInput } from '../../common/interfaces/pageinate-input.interface';
import { apiCollection } from '../../common/responses/api-collection';
import { pretty } from '../../common/helpers/pretty.helper';
import { apiResource } from '../../common/responses/api-resource';
import { UserPolicy } from './user.policy';
import { UserService } from './user.service';




export function UserRoutes(arg: { app: ExpressContext }): Router {
  const { app } = arg;
  const router = Router();

  // findMany
  router.get('/', mw(async (ctx) => {
    const { req, res } = ctx;
    const page: IPaginateInput = { offset: 0, limit: 15 };
    const { offset, limit } = page;
    ctx.authorize(await UserPolicy.canFindMany({ ctx }));

    const results = await QueryRunner.transact(async ({ runner }) => {
      const { transaction } = runner;
      const results = await UserModel.findAndCountAll({ transaction, limit, offset });
      return results;
    });

    const collection = apiCollection({ results, page });
    res.status(HttpCode.OK).json(collection);
  }));


  // findOne
  router.get('/:id', mw(async (ctx) => {
    const id = ctx.req.params.id;
    const { res } = ctx;
    ctx.authorize(await UserPolicy.canFindMany({ ctx }));

    const model = await QueryRunner.transact(async ({ runner }) => {
      const { transaction } = runner;
      const model = await UserModel.findByPk(id, { transaction });
      return model;
    });

    if (is.null(model)) {
      throw ctx.except(NotFoundException({ error: ctx.lang(UserLang.NotFound) }));
    }
    ctx.authorize(await UserPolicy.canFindOne({ ctx, model }));

    const resource = apiResource({ result: model });
    res.status(HttpCode.OK).json(resource);
  }));


  // create
  router.post('/', mw(async (ctx) => {
    const { req, res } = ctx;
    const { body } = req;

    ctx.authorize(await UserPolicy.canCreate({ ctx }));

    const validation = validate(CreateUserDto, body);
    if (isLeft(validation)) {
      throw ctx.except(BadRequestException({
        error: ctx.lang(ExceptionLang.BadRequest),
        data: validation.left,
      }));
    }
    const dto = validation.right;

    const model = await QueryRunner.transact(async ({ runner }) => {
      const { transaction } = runner;
      const model = await UserService.create({ ctx, runner, dto });
      await model.reload({});
      return model;
    });

    Dbg.App(`User created: ${pretty(model)}`);
    const resource = apiResource({ result: model }) ;
    res.status(HttpCode.OK).json(resource);
  }));

  return router;
}