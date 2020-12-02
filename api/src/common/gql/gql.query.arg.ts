import { GraphQLFieldConfigArgumentMap, GraphQLInputObjectType } from "graphql";
import { IGqlCollectionOptions } from "./gql.collection.options";

export interface IGqlQueryArg { 
  query: IGqlCollectionOptions;
}

export function gqlQueryArg(arg: GraphQLInputObjectType): GraphQLFieldConfigArgumentMap {
  return { query: { type: arg } };
}