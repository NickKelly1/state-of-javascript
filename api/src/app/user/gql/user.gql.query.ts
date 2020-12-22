import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { BadRequestException } from "../../../common/exceptions/types/bad-request.exception";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { UserTokenLang } from "../../../common/i18n/packs/user-token.lang";
import { UserTokenAssociation } from "../../user-token/user-token.associations";
import { UserByTokenGqlInput, UserByTokenGqlInputValidator } from "../gql-input/user-by-token.gql";
import { UserLang } from "../user.lang";
import { IUserCollectionGqlNodeSource, UserCollectionGqlNode } from "./user.collection.gql.node";
import { UserCollectionOptionsGqlInput } from "./user.collection.gql.options";
import { IUserGqlNodeSource, UserGqlNode } from "./user.gql.node";

export const UserGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  users: {
    type: GraphQLNonNull(UserCollectionGqlNode),
    args: gqlQueryArg(UserCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<IUserCollectionGqlNodeSource> => {
      // authorise access
      ctx.authorize(ctx.services.userPolicy.canAccess(), UserLang.CannotAccess);
      // authorise find-many
      ctx.authorize(ctx.services.userPolicy.canFindMany(), UserLang.CannotFindMany);
      // find
      const collection = await ctx.services.userRepository.gqlCollection({
        runner: null,
        args,
      });
      return collection;
    },
  },

  userByToken: {
    type: GraphQLNonNull(UserGqlNode),
    args: gqlQueryArg(UserByTokenGqlInput),
    resolve: async (parent, args, ctx): Promise<IUserGqlNodeSource> => {
      // no authorisation required on this route
      // user must have a good token...
      const dto = ctx.validate(UserByTokenGqlInputValidator, args.query);
      const userToken = await ctx.services.userTokenRepository.findOneBySlugOrFail(dto.token, {
        runner: null,
        options: {
          include: [{ association: UserTokenAssociation.user, }],
        },
      });
      if (userToken.isExpired()) {
        const message = ctx.lang(UserTokenLang.TokenExpired);
        throw new BadRequestException(message);
      }
      const user = assertDefined(userToken.user);
      return user;
    },
  },
});