import { GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import Joi from 'joi';
import { RoleDefinition } from '../role.definition';

export interface ICreateRoleGqlInput {
  name: string;
  permission_ids?: number[];
}

export const CreateRoleGqlInput = new GraphQLInputObjectType({
  name: 'CreateRole',
  fields: () => ({
    name: { type: GraphQLNonNull(GraphQLString), },
    permission_ids: { type: GraphQLList(GraphQLNonNull(GraphQLInt)), },
  }),
})


export const CreateRoleValidator = Joi.object<ICreateRoleGqlInput>({
  name: Joi.string().min(RoleDefinition.name.min).max(RoleDefinition.name.max).required(),
  permission_ids: Joi.array().items(Joi.number().integer().positive().optional()),
});
