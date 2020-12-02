import { Router } from "express";
import { Op } from "sequelize";
import { ExpressContext } from "../../common/classes/express-context";
import { InternalServerException } from "../../common/exceptions/types/internal-server.exception";
import { assertDefined } from "../../common/helpers/assert-defined.helper";
import { mw } from "../../common/helpers/mw.helper";
import { InternalServerExceptionLang } from "../../common/i18n/packs/internal-server-exception.lang";
import { UserTokenType } from "../user-token-type/user-token-type.const";
import { UserTokenAssociation } from "./user-token.associations";
import { UserTokenField } from "./user-token.attributes";

export function UserTokenRoutes(arg: { app: ExpressContext }): Router {
  const router = Router();

  // router.get('/slug/:slug', mw(async (ctx, next) => {
  //   const slug = ctx.req.params.slug;
  //   const final = await ctx.services.universal.db.transact(async ({ runner }) => {
  //     const link = await ctx.services.userTokenRepository.findOneOrfail({
  //       runner,
  //       options: {
  //         where: { [UserTokenField.slug]: { [Op.eq]: slug }, },
  //         include: [
  //           { association: UserTokenAssociation.type, },
  //           { association: UserTokenAssociation.user, },
  //         ]
  //       },
  //     });

  //     const type = assertDefined(link.type);
  //     const user = assertDefined(link.user);

  //     // send email slug
  //     // token
  //     // 

  //     switch (type.id) {
  //       case UserTokenType.ForgottenPasswordReset: {
  //         // ? todo
  //         break;
  //       }
  //       case UserTokenType.VerifyEmail: {
  //         // ? todo
  //         break;
  //       }
  //       case UserTokenType.AcceptWelcome: {
  //         // ? todo
  //         break;
  //       }
  //       default: {
  //         const message = ctx.lang(InternalServerExceptionLang.UnhandledUserLinkType({ type_id: type.id }));
  //         throw ctx.except(InternalServerException({ message, }))
  //       }
  //     }

  //     // delete the link so it can't be re-used
  //     await ctx.services.userTokenService.softDelete({ runner, model: link });
  //     //
  //   });
  //   // find the corresponding link & handle accordingly...
  // }));

  return router;
}