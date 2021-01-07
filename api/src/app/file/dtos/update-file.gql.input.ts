// import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
// import Joi from 'joi';
// import { OrNullable } from '../../../common/types/or-nullable.type';
// import { FileDefinition } from '../file.definition';

// export interface IUpdateFileInput {
//   id: number;
//   body?: OrNullable<string>;
//   visible?: OrNullable<boolean>;
//   hidden?: OrNullable<boolean>;
// }

// export const UpdateFileGqlInput = new GraphQLInputObjectType({
//   name: 'UpdateFile',
//   fields: () => ({
//     id: { type: GraphQLNonNull(GraphQLInt), },
//     body: { type: GraphQLString, },
//     visible: { type: GraphQLBoolean, },
//     hidden: { type: GraphQLBoolean, },
//   }),
// })

// export const UpdateFileValidator = Joi.object<IUpdateFileInput>({
//   id: Joi.number().integer().positive().required(),
//   body: Joi.string().min(FileDefinition.body.min).max(FileDefinition.body.max).optional(),
//   visible: Joi.boolean().optional(),
//   hidden: Joi.boolean().optional(),
// });

export {};
