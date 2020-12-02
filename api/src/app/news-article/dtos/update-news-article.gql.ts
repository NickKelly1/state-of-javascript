import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import Joi from 'joi';
import { PermissionId } from '../../permission/permission-id.type';
import { RoleId } from '../../role/role.id.type';
import { NewsArticleDefinition } from '../news-article.definition';

export interface IUpdateNewsArticleInput {
  id: number;
  title?: string;
  teaser?: string;
  body?: string;
}

export const UpdateNewsArticleGqlInput = new GraphQLInputObjectType({
  name: 'UpdateNewsArticle',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    title: { type: GraphQLString, },
    teaser: { type: GraphQLString, },
    body: { type: GraphQLString, },
  }),
})

export const UpdateNewsArticleValidator = Joi.object<IUpdateNewsArticleInput>({
  id: Joi.number().integer().positive().required(),
  title: Joi.string().min(NewsArticleDefinition.title.min).max(NewsArticleDefinition.title.max).optional(),
  teaser: Joi.string().min(NewsArticleDefinition.teaser.min).max(NewsArticleDefinition.teaser.max).optional(),
  body: Joi.string().min(NewsArticleDefinition.body.min).max(NewsArticleDefinition.body.max).optional(),
});
