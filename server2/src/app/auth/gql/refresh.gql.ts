import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import Joi from "joi";

// ---------------
// ---- input ----
// ---------------

export interface IRefreshDto {
  refresh_token?: string;
}

export const RefreshDtoValidator = Joi.object<IRefreshDto>({
  refresh_token: Joi.string(),
});
