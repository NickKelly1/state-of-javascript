import {
  GraphQLSchema,
} from 'graphql';
import { GqlRootMutation } from './gql.root.mutation';
import { GqlRootQuery } from './gql.root.query';

export const GqlSchema = new GraphQLSchema({
  query: GqlRootQuery,
  mutation: GqlRootMutation,
});
