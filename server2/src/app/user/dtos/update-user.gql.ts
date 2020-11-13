import { GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import Joi from 'joi';
import { UserModel } from '../../../circle';
import { OrNullable } from '../../../common/types/or-nullable.type';
import { UserDefinition } from '../user.definition';

export interface IUpdateUserInput {
  id: number;
  name?: OrNullable<string>;
  role_ids?: OrNullable<number[]>;
}

export const UpdateUserGqlInput = new GraphQLInputObjectType({
  name: 'UpdateUser',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    name: { type: GraphQLString, },
    role_ids: { type: GraphQLList(GraphQLNonNull(GraphQLInt)), },
  }),
});

export const UpdateUserValidator = Joi.object<IUpdateUserInput>({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().min(UserDefinition.name.min).max(UserDefinition.name.max).optional(),
  role_ids: Joi.array().items(Joi.number().integer().positive().required()).optional(),
});
