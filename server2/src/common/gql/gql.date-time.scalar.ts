import { GraphQLScalarType, Kind } from "graphql";
import { OrNull } from "../types/or-null.type";

// https://github.com/graphql/graphql-js/issues/497
export type IGqlDateTimeScalar = Date;
export const GqlDateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'ISO string',
  // parse value from client
  parseValue(value: string): Date { return new Date(value); },
  // serialize value from server
  serialize(value: number | string | Date): string {
    if (typeof value === 'string') {
      return new Date(value).toISOString();
    }
    if (typeof value === 'number') {
      return new Date(value).toISOString();
    }
    return value.toISOString();
  },
  parseLiteral(ast): OrNull<string> {
    // ast value is always in string format
    if (ast.kind === Kind.STRING) { return ast.value; }
    // if (ast.kind === Kind.INT) { return parseInt(ast.value, 10); }
    return null
  }
  // DateTime
})