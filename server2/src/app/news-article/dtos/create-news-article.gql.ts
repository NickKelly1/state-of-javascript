import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import Joi from 'joi';
import { NewsArticleDefinition } from '../news-article.definition';

export interface ICreateNewsArticleInput {
  title: string;
  teaser: string;
  body: string;
}

export const CreateNewsArticleGqlInput = new GraphQLInputObjectType({
  name: 'CreateNewsArticle',
  fields: () => ({
    title: { type: GraphQLNonNull(GraphQLString), },
    teaser: { type: GraphQLNonNull(GraphQLString), },
    body: { type: GraphQLNonNull(GraphQLString), },
  }),
})

export const CreateNewsArticleValidator = Joi.object<ICreateNewsArticleInput>({
  title: Joi.string().min(NewsArticleDefinition.title.min).max(NewsArticleDefinition.title.max).required(),
  teaser: Joi.string().min(NewsArticleDefinition.teaser.min).max(NewsArticleDefinition.teaser.max).required(),
  body: Joi.string().min(NewsArticleDefinition.body.min).max(NewsArticleDefinition.body.max).required(),
});
