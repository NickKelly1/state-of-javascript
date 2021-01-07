// import { GraphQLFloat, GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
// import Joi from 'joi';
// import { FileDefinition } from '../file.definition';

// export interface ICreateFileInput {
//   blog_post_id: number;
//   body: string;
// }

// export const CreateFileGqlInput = new GraphQLInputObjectType({
//   name: 'CreateFile',
//   fields: () => ({
//     blog_post_id: { type: GraphQLNonNull(GraphQLFloat), },
//     body: { type: GraphQLNonNull(GraphQLString), },
//   }),
// })

// export const CreateFileValidator = Joi.object<ICreateFileInput>({
//   blog_post_id: Joi.number().integer().positive().required(),
//   body: Joi.string().min(FileDefinition.body.min).max(FileDefinition.body.max).required(),
// });

// export {};