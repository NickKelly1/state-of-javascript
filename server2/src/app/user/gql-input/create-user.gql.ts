import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import Joi from 'joi';
import { OrNullable } from '../../../common/types/or-nullable.type';
import { UserPasswordDefinition } from '../../user-password/user-password.definition';
import { UserDefinition } from '../user.definition';

export interface ICreateUserInput {
  name: string;
  email?: string;
  password?: string;
  role_ids?: OrNullable<number[]>;
}

export const CreateUserGqlInput = new GraphQLInputObjectType({
  name: 'CreateUser',
  fields: () => ({
    name: { type: GraphQLNonNull(GraphQLString), },
    email: { type: GraphQLString, },
    password: { type: GraphQLString, },
    role_ids: { type: GraphQLList(GraphQLNonNull(GraphQLInt)), },
  }),
});

export const CreateUserValidator = Joi.object<ICreateUserInput>({
  name: Joi.string().min(UserDefinition.name.min).max(UserDefinition.name.max).required(),
  email: Joi.string().email().min(UserDefinition.email.min).max(UserDefinition.email.max).optional(),
  password: Joi.string().min(UserPasswordDefinition.password.min).max(UserPasswordDefinition.password.max).optional(),
  role_ids: Joi.array().items(Joi.number().integer().positive().required()).optional(),
});
