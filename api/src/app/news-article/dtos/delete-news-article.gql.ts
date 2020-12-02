import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull } from 'graphql';
import Joi from 'joi';

export interface IDeleteNewsArticleInput {
  id: number;
}

export const DeleteNewsArticleGqlInput = new GraphQLInputObjectType({
  name: 'DeleteNewsArticle',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
  }),
})

export const DeleteNewsArticleValidator = Joi.object<IDeleteNewsArticleInput>({
  id: Joi.number().integer().positive().required(),
});
