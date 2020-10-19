import { GraphQLFieldConfigArgumentMap } from "graphql";
import { CollectionGqlInput, ICollectionGqlInput } from "./gql.collection";

export interface IGqlConnectionArgOptions {
  options?: ICollectionGqlInput;
}

export const connectionGqlArg: GraphQLFieldConfigArgumentMap = {
  options: {
    type: CollectionGqlInput,
  },
}