import { IAccessTokenDto } from "./access-token.dto";

export interface ISignupRo {
  access_token: string;
  refresh_token: string;

  access_token_iat: number;
  access_token_exp: number;

  refresh_token_iat: number;
  refresh_token_exp: number;
}