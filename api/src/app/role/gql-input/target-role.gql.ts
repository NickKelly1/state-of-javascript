import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull } from 'graphql';
import Joi from 'joi';

export interface ITargetRoleGqlInput {
  id: number;
}

export const TargetRoleGqlInput = new GraphQLInputObjectType({
  name: 'TargetRole',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
  }),
})


export const TargetRoleValidator = Joi.object<ITargetRoleGqlInput>({
  id: Joi.number().integer().positive().required(),
});
