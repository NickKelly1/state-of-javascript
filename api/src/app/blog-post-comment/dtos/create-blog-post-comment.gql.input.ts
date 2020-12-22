import { GraphQLFloat, GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import Joi from 'joi';
import { BlogPostCommentDefinition } from '../blog-post-comment.definition';

export interface ICreateBlogPostCommentInput {
  blog_post_id: number;
  body: string;
}

export const CreateBlogPostCommentGqlInput = new GraphQLInputObjectType({
  name: 'CreateBlogPostComment',
  fields: () => ({
    blog_post_id: { type: GraphQLNonNull(GraphQLFloat), },
    body: { type: GraphQLNonNull(GraphQLString), },
  }),
})

export const CreateBlogPostCommentValidator = Joi.object<ICreateBlogPostCommentInput>({
  blog_post_id: Joi.number().integer().positive().required(),
  body: Joi.string().min(BlogPostCommentDefinition.body.min).max(BlogPostCommentDefinition.body.max).required(),
});
