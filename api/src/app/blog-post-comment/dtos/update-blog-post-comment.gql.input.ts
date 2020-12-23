import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import Joi from 'joi';
import { OrNullable } from '../../../common/types/or-nullable.type';
import { BlogPostCommentDefinition } from '../blog-post-comment.definition';

export interface IUpdateBlogPostCommentInput {
  id: number;
  body?: OrNullable<string>;
  visible?: OrNullable<boolean>;
  hidden?: OrNullable<boolean>;
}

export const UpdateBlogPostCommentGqlInput = new GraphQLInputObjectType({
  name: 'UpdateBlogPostComment',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    body: { type: GraphQLString, },
    visible: { type: GraphQLBoolean, },
    hidden: { type: GraphQLBoolean, },
  }),
})

export const UpdateBlogPostCommentValidator = Joi.object<IUpdateBlogPostCommentInput>({
  id: Joi.number().integer().positive().required(),
  body: Joi.string().min(BlogPostCommentDefinition.body.min).max(BlogPostCommentDefinition.body.max).optional(),
  visible: Joi.boolean().optional(),
  hidden: Joi.boolean().optional(),
});
