import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import Joi from "joi";
import { UserPasswordDefinition } from "../../user-password/user-password.definition";
import { UserDefinition } from "../../user/user.definition";

// ---------------
// ---- input ----
// ---------------

export interface ILoginGqlInput {
  name: string;
  password: string;
}

export const LoginGqlInputValidator = Joi.object<ILoginGqlInput>({
  name: Joi.string().min(UserDefinition.name.min).max(UserDefinition.name.max).required(),
  password: Joi.string().min(UserPasswordDefinition.password.min).max(UserPasswordDefinition.password.max).required(),
});

export const LoginGqlInput = new GraphQLInputObjectType({
  name: 'LoginInput',
  fields: () => ({
    name: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  }),
});
