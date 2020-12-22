import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import Joi from 'joi';
import { BlogPostDefinition } from '../blog-post.definition';

export interface ICreateBlogPostInput {
  title: string;
  teaser: string;
  body: string;
}

export const CreateBlogPostGqlInput = new GraphQLInputObjectType({
  name: 'CreateBlogPost',
  fields: () => ({
    title: { type: GraphQLNonNull(GraphQLString), },
    teaser: { type: GraphQLNonNull(GraphQLString), },
    body: { type: GraphQLNonNull(GraphQLString), },
  }),
})

export const CreateBlogPostValidator = Joi.object<ICreateBlogPostInput>({
  title: Joi.string().min(BlogPostDefinition.title.min).max(BlogPostDefinition.title.max).required(),
  teaser: Joi.string().min(BlogPostDefinition.teaser.min).max(BlogPostDefinition.teaser.max).required(),
  body: Joi.string().min(BlogPostDefinition.body.min).max(BlogPostDefinition.body.max).required(),
});
