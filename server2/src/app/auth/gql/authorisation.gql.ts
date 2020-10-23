import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { AccessTokenGqlObj, IAccessToken } from "../token/access.token.gql";
import { IRefreshToken, RefreshTokenGqlObj } from "../token/refresh.token.gql";

// ----------------
// ---- output ----
// ----------------

export interface IAuthorisationRo {
  access_token: string;
  refresh_token: string;
  access_token_object: IAccessToken;
  refresh_token_object: IRefreshToken;
  user: {
    name: string;
  }
}
