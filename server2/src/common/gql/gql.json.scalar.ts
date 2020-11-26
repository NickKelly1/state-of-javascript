import { GraphQLScalarType, Kind } from "graphql";
import { IJson } from "../interfaces/json.interface";
import { OrNull } from "../types/or-null.type";

// https://github.com/graphql/graphql-js/issues/497
export const GqlJsonObjectScalar = new GraphQLScalarType({
  name: 'JsonObject',
  description: 'Json object with unknown keys & values',
  // parse value from client
  // parseValue(value: string): Date { return new Date(value); },
  // serialize value from server
  // serialize(value: IJson): IJson { return value; },
  // parseLiteral(ast): OrNull<object> {
  //   // ast value is always in string format
  //   if (ast.kind === Kind.OBJECT) { return ast.fields; }
  //   // if (ast.kind === Kind.INT) { return parseInt(ast.value, 10); }
  //   return null
  // }
  // DateTime
})