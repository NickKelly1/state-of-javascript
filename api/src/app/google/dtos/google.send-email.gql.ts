import { GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import Joi from 'joi';
import { GqlJsonObjectScalar } from '../../../common/gql/gql.json.scalar';
import { IJson } from '../../../common/interfaces/json.interface';
import { OrNull } from '../../../common/types/or-null.type';
import { GoogleDefinition } from '../google.definition';

export interface IGoogleSendEmailGqlInput {
  to: string[];
  cc?: OrNull<string[]>;
  subject: string;
  body: string;
}

export const GoogleSendEmailGqlInput = new GraphQLInputObjectType({
  name: 'GoogleSendEmail',
  fields: () => ({
    to: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString))), },
    cc: { type: GraphQLList(GraphQLNonNull(GraphQLString)), },
    subject: { type: GraphQLString, },
    body: { type: GraphQLString, },
  }),
})


export const GoogleSendEmailGqlInputValidator = Joi.object<IGoogleSendEmailGqlInput>({
  to: Joi.array().items(Joi.string().required()).required(),
  cc: Joi.array().items(Joi.string().required()).optional(),
  subject: Joi.string().min(GoogleDefinition.email.subject.min).max(GoogleDefinition.email.subject.max).required(),
  body: Joi.string().min(GoogleDefinition.email.body.min).max(GoogleDefinition.email.body.max).required(),
});
