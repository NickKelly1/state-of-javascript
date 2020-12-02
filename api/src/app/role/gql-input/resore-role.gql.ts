import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import Joi from 'joi';

export interface IRestoreRoleGqlInput {
  id: number;
}

export const RestoreRoleGqlInput = new GraphQLInputObjectType({
  name: 'RestoreRole',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
  }),
})


export const RestoreRoleGqlInputValidator = Joi.object<IRestoreRoleGqlInput>({
  id: Joi.number().integer().positive().required(),
});
