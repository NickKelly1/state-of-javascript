import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { UserModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { BadRequestException } from "../../../common/exceptions/types/bad-request.exception";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { assertDefined } from "../../../common/helpers/assert-defined.helper";
import { UserTokenLang } from "../../../common/i18n/packs/user-token.lang";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { OrNull } from "../../../common/types/or-null.type";
import { UserTokenAssociation } from "../../user-token/user-token.associations";
import { UserByTokenGqlInput, UserByTokenGqlInputValidator } from "../gql-input/user-by-token.gql";
import { IUserCollectionGqlNodeSource, UserCollectionGqlNode } from "./user.collection.gql.node";
import { UserCollectionOptionsGqlInput } from "./user.collection.gql.options";
import { IUserGqlNodeSource, UserGqlNode } from "./user.gql.node";

export const UserGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  users: {
    type: GraphQLNonNull(UserCollectionGqlNode),
    args: gqlQueryArg(UserCollectionOptionsGqlInput),
    resolve: async (parent, args, ctx): Promise<IUserCollectionGqlNodeSource> => {
      ctx.authorize(ctx.services.userPolicy.canFindMany());
      const { page, options } = transformGqlQuery(args);
      const { rows, count } = await ctx.services.userRepository.findAllAndCount({
        runner: null,
        options: { ...options },
      });
      const pagination = collectionMeta({ data: rows, total: count, page });
      const connection: IUserCollectionGqlNodeSource = {
        models: rows.map((model): OrNull<UserModel> =>
          ctx.services.userPolicy.canFindOne({ model })
            ? model
            : null
          ),
        pagination,
      };
      return connection;
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