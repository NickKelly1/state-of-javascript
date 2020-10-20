import { GraphQLFieldConfigArgumentMap, GraphQLInputObjectType } from "graphql";
import { IGqlQuery } from "./gql.query";

export interface IGqlQueryArg { 
  query: IGqlQuery;
}

export function gqlQueryArg(arg: GraphQLInputObjectType): GraphQLFieldConfigArgumentMap {
  return { query: { type: arg } };
}