import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import Joi from 'joi';
import { UserModel } from '../../../circle';
import { UserDefinition } from '../user.definition';

export interface IDeleteUserInput {
  id: number;
}

export const DeleteUserGqlInput = new GraphQLInputObjectType({
  name: 'DeleteUser',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
  }),
});

export const DeleteUserValidator = Joi.object<IDeleteUserInput>({
  id: Joi.number().integer().positive().required(),
});
