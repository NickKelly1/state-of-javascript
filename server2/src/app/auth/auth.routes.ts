import { Router } from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';
import { ExpressContext } from '../../common/classes/express-context';
import { HttpCode } from '../../common/constants/http-code.const';
import { mw } from '../../common/helpers/mw.helper';
import { JsonResponder } from '../../common/responses/json.responder';
import { ICreateUserPasswordDto } from '../user-password/dtos/create-user-password.dto';
import { ICreateUserDto } from '../user/dtos/create-user.dto';
import { SignupDto } from './dtos/signup.dto';
import { ISignupRo } from './dtos/signup.ro';

export function AuthRoutes(arg: { app: ExpressContext }): Router {
  const { app } = arg;
  const router = Router();

  // const strat = new passportLocal.Strategy(
  //   {
  //     // usernameField: 'name',
  //     // usernameField: 'name',
  //     usernameField: 'durr',
  //     // passwordField: 'password',
  //   },
  //   async function verify(email, password, done) {
  //     //
  //   },
  // );

  // passport.use(
  //   'signup',
  //   strat,
  // );

  router.post(
    '/signup',
    mw<JsonResponder<ISignupRo>>(async (ctx, next) => {
      const { req, res } = ctx;
      const dto = ctx.body(SignupDto);

      const { user } = await ctx.services.dbService().transact(async ({ runner }) => {
        const userDto: ICreateUserDto = { name: dto.name };
        const user = await ctx.services.userService().create({ runner, dto: userDto, });

        const passwordDto: ICreateUserPasswordDto = { password: dto.password };
        const password = await ctx.services.userPasswordService().create({ runner, user, dto: passwordDto });

        return { user, };
      });

      const access = ctx.services.jwtService().createAccessToken({ partial: { permissions: [], user_id: user.id } });
      const refresh = ctx.services.jwtService().createRefreshToken({ partial: { user_id: user.id } });
      const access_token = ctx.services.jwtService().signAccessToken({ access });
      const refresh_token = ctx.services.jwtService().signRefreshToken({ refresh });

      const ro: ISignupRo = {
        access_token,
        refresh_token,
        access_token_exp: access.exp,
        access_token_iat: access.iat,
        refresh_token_exp: refresh.exp,
        refresh_token_iat: refresh.iat,
      }

      return new JsonResponder(HttpCode.CREATED, ro);
    }),
  );

  return router;
}