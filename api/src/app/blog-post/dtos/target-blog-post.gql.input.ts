import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull } from 'graphql';
import Joi from 'joi';

export interface ITargetBlogPostInput {
  id: number;
}

export const TargetBlogPostGqlInput = new GraphQLInputObjectType({
  name: 'DeleteBlogPost',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
  }),
})

export const TargetBlogPostValidator = Joi.object<ITargetBlogPostInput>({
  id: Joi.number().integer().positive().required(),
});
