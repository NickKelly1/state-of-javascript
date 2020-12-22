import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull } from 'graphql';
import Joi from 'joi';

export interface ITargetBlogPostCommentInput {
  id: number;
}

export const TargetBlogPostCommentGqlInput = new GraphQLInputObjectType({
  name: 'TargetBlogPostComment',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
  }),
})

export const TargetBlogPostCommentValidator = Joi.object<ITargetBlogPostCommentInput>({
  id: Joi.number().integer().positive().required(),
});
