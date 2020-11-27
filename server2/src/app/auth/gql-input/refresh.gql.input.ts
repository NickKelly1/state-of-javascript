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


// gql

export interface IRefreshGqlInput {
  refresh_token?: string;
}

export const RefreshGqlInput = new GraphQLInputObjectType({
  name: 'Refresh',
  fields: () => ({
    refresh_token: { type: GraphQLString },
  }),
});

export const RefreshGqlInputValidator = Joi.object<IRefreshGqlInput>({
  refresh_token: Joi.string(),
});