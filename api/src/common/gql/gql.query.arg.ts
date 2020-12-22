import { GraphQLFieldConfigArgumentMap, GraphQLInputObjectType } from "graphql";
import { IGqlCollectionOptions } from "./gql.collection.options";

export interface IGqlQueryArg { 
  query: IGqlCollectionOptions;
}

export function gqlQueryArg(arg: GraphQLInputObjectType): GraphQLFieldConfigArgumentMap {
  return { query: { type: arg } };
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IGqlArgs { [argName: string]: any; }