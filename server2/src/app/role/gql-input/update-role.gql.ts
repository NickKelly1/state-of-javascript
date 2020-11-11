import { GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import Joi from 'joi';
import { RoleModel } from '../../../circle';
import { RoleDefinition } from '../role.definition';
import { RoleId } from '../role.id.type';

export interface IUpdateRoleGqlInput {
  id: number;
  name?: string;
  permission_ids?: number[];
}

export const UpdateRoleGqlInput = new GraphQLInputObjectType({
  name: 'UpdateRole',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    name: { type: GraphQLString, },
    permission_ids: { type: GraphQLList(GraphQLNonNull(GraphQLInt)), },
  }),
})


export const UpdateRoleValidator = Joi.object<IUpdateRoleGqlInput>({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().min(RoleDefinition.name.min).max(RoleDefinition.name.max).optional(),
  permission_ids: Joi.array().items(Joi.number().integer().positive().optional()),
});
