import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import Joi from 'joi';
import { OrNullable } from '../../../common/types/or-nullable.type';
import { BlogPostDefinition } from '../blog-post.definition';

export interface IUpdateBlogPostInput {
  id: number;
  title?: OrNullable<string>;
  teaser?: OrNullable<string>;
  body?: OrNullable<string>;
}

export const UpdateBlogPostGqlInput = new GraphQLInputObjectType({
  name: 'UpdateBlogPost',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    title: { type: GraphQLString, },
    teaser: { type: GraphQLString, },
    body: { type: GraphQLString, },
  }),
})

export const UpdateBlogPostValidator = Joi.object<IUpdateBlogPostInput>({
  id: Joi.number().integer().positive().required(),
  title: Joi.string().min(BlogPostDefinition.title.min).max(BlogPostDefinition.title.max).optional(),
  teaser: Joi.string().min(BlogPostDefinition.teaser.min).max(BlogPostDefinition.teaser.max).optional(),
  body: Joi.string().min(BlogPostDefinition.body.min).max(BlogPostDefinition.body.max).optional(),
});
