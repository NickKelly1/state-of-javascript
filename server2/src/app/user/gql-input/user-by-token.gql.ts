import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import Joi from "joi";
import { GqlCollectionOptionsInputFactory } from "../../../common/gql/gql.collection.options";
import { GqlFilterFieldType } from "../../../common/gql/gql.filter.types";

export interface IUserByTokenGqlInput {
  token: string;
}

export const UserByTokenGqlInput = new GraphQLInputObjectType({
  name: 'UserByToken',
  fields: () => ({
    token: { type: GraphQLNonNull(GraphQLString), },
  }),
});

export const UserByTokenGqlInputValidator = Joi.object<IUserByTokenGqlInput>({
  token: Joi.string().required(),
});
