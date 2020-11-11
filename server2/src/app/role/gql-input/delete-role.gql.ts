import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import Joi from 'joi';

export interface IDeleteRoleGqlInput {
  id: number;
}

export const DeleteRoleGqlInput = new GraphQLInputObjectType({
  name: 'DeleteRole',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
  }),
})


export const DeleteRoleValidator = Joi.object<IDeleteRoleGqlInput>({
  id: Joi.number().integer().positive().required(),
});
