import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import Joi from 'joi';
import { PermissionId } from '../../permission/permission-id.type';
import { RoleId } from '../../role/role.id.type';
import { NewsArticleDefinition } from '../news-article.definition';

export interface ICreateNewsArticleDto {
  title: string;
  teaser: string;
  body: string;
}

export const CreateNewsArticleGqlDto = new GraphQLInputObjectType({
  name: 'CreateNewsArticle',
  fields: () => ({
    title: { type: GraphQLNonNull(GraphQLString), },
    teaser: { type: GraphQLNonNull(GraphQLString), },
    body: { type: GraphQLNonNull(GraphQLString), },
  }),
})

export const CreateNewsArticleDto = Joi.object<ICreateNewsArticleDto>({
  title: Joi.string().min(NewsArticleDefinition.title.min).max(NewsArticleDefinition.title.max).required(),
  teaser: Joi.string().min(NewsArticleDefinition.teaser.min).max(NewsArticleDefinition.teaser.max).required(),
  body: Joi.number().min(NewsArticleDefinition.body.min).max(NewsArticleDefinition.body.max).required(),
});
