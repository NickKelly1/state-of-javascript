import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import Joi from 'joi';
import { OrNullable } from '../../../common/types/or-nullable.type';
import { UserPasswordDefinition } from '../../user-password/user-password.definition';
import { UserDefinition } from '../user.definition';

export interface IUpdateUserInput {
  id: number;
  name?: OrNullable<string>;
  email?: OrNullable<string>;
  deactivated?: OrNullable<boolean>;
  password?: OrNullable<string>;
  role_ids?: OrNullable<number[]>;
}

export const UpdateUserGqlInput = new GraphQLInputObjectType({
  name: 'UpdateUser',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    name: { type: GraphQLString, },
    email: { type: GraphQLString, },
    deactivated: { type: GraphQLBoolean, },
    password: { type: GraphQLString, },
    role_ids: { type: GraphQLList(GraphQLNonNull(GraphQLInt)), },
  }),
});

export const UpdateUserValidator = Joi.object<IUpdateUserInput>({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().min(UserDefinition.name.min).max(UserDefinition.name.max).optional(),
  email: Joi.string().email().min(UserDefinition.email.min).max(UserDefinition.email.max).optional(),
  deactivated: Joi.bool().optional(),
  password: Joi.string().min(UserPasswordDefinition.password.min).max(UserPasswordDefinition.password.max).optional(),
  role_ids: Joi.array().items(Joi.number().integer().positive().required()).optional(),
});
