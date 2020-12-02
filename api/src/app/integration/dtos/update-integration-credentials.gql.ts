import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull } from 'graphql';
import Joi from 'joi';
import { GqlJsonObjectScalar } from '../../../common/gql/gql.json.scalar';
import { IJson } from '../../../common/interfaces/json.interface';

export interface IInitialiseIntegrationGqlInput {
  id: number;
  init: IJson;
}

export const InitialiseIntegrationGqlInput = new GraphQLInputObjectType({
  name: 'InitialiseIntegration',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    init: { type: GraphQLNonNull(GqlJsonObjectScalar), },
  }),
})


export const InitialiseIntegrationGqlInputValidator = Joi.object<IInitialiseIntegrationGqlInput>({
  id: Joi.number().integer().positive().required(),
  init: Joi.object(),
});
