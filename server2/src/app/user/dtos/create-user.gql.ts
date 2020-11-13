import { GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import Joi from 'joi';
import { OrNullable } from '../../../common/types/or-nullable.type';
import { UserDefinition } from '../user.definition';

export interface ICreateUserInput {
  name: string;
  role_ids?: OrNullable<number[]>;
}

export const CreateUserGqlInput = new GraphQLInputObjectType({
  name: 'CreateUser',
  fields: () => ({
    name: { type: GraphQLNonNull(GraphQLString), },
    role_ids: { type: GraphQLList(GraphQLNonNull(GraphQLInt)), },
  }),
});

export const CreateUserValidator = Joi.object<ICreateUserInput>({
  name: Joi.string().min(UserDefinition.name.min).max(UserDefinition.name.max).required(),
  role_ids: Joi.array().items(Joi.number().integer().positive().required()).optional(),
});
