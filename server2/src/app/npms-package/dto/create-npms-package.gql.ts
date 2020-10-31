import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import Joi from 'joi';
import { UserModel } from '../../../circle';
import { NpmsPackageDefinition } from '../npms-package.definition';

export interface ICreateNpmsPackageInput {
  name: string;
}

export const CreateNpmsPackageGqlInput = new GraphQLInputObjectType({
  name: 'CreateNpmsPackage',
  fields: () => ({
    name: { type: GraphQLNonNull(GraphQLString), },
  }),
})


export const CreateNpmsPackageValidator = Joi.object<ICreateNpmsPackageInput>({
  name: Joi.string().min(NpmsPackageDefinition.name.min).max(NpmsPackageDefinition.name.max).required(),
});
