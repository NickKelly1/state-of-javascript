import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInputFieldConfig,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { ucFirst } from "../helpers/uc-first.helper";
import { GqlDateTimeScalar } from "./gql.date-time.scalar";

export const GqlFilterRangeDateTime: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: 'FilterRangeDateTime',
  fields: () => ({
    from: { type: GraphQLNonNull(GqlDateTimeScalar) },
    to: { type: GraphQLNonNull(GqlDateTimeScalar) },
  }),
});

export const GqlFilterRangeFloat: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: 'FilterRangeFloat',
  fields: () => ({
    from: { type: GraphQLNonNull(GraphQLFloat) },
    to: { type: GraphQLNonNull(GraphQLFloat) },
  }),
});


export const GqlFilterRangeString: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: 'FilterRangeString',
  fields: () => ({
    from: { type: GraphQLNonNull(GraphQLString) },
    to: { type: GraphQLNonNull(GraphQLString) },
  }),
});


export type IGqlFilterRange = {
  from: string | number,
  to: string | number,
}

// closely related to sequelzie types...
export interface IGqlFilterField {
  eq: string | number | boolean;
  neq: string | number | boolean;
  null: boolean;
  gt: string | number;
  gte: string | number;
  lt: string | number;
  lte: string | number;
  nbetween: IGqlFilterRange;
  between: IGqlFilterRange;
  in: (string | number | boolean)[];
  nin: (string | number | boolean)[];
  ilike: string;
  nilike: string;
  like: string;
  nlike: string;
  overlap: IGqlFilterRange;
  substring: string;
  iregexp: string;
  niregexp: string;
  regexp: string;
  nregexp: string;
  strict_left: IGqlFilterRange;
  strict_right: IGqlFilterRange;
}

export const GqlFilterFieldNumber: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: 'FilterFieldNumber',
  fields: () => ({
    eq: { type: GraphQLFloat },
    neq: { type: GraphQLFloat },
    null: { type: GraphQLBoolean },
    gt: { type: GraphQLFloat },
    gte: { type: GraphQLFloat },
    lt: { type: GraphQLFloat },
    lte: { type: GraphQLFloat },
    nbetween: { type: GqlFilterRangeFloat },
    between: { type: GqlFilterRangeFloat },
    in: { type: GraphQLFloat },
    nin: { type: GraphQLFloat },
    strict_left: { type: GqlFilterRangeFloat },
    strict_right: { type: GqlFilterRangeFloat },
  }),
});

export const GqlFilterFieldDateTime: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: 'FilterFieldDateTime',
  fields: () => ({
    eq: { type: GqlDateTimeScalar },
    neq: { type: GqlDateTimeScalar },
    null: { type: GraphQLBoolean },
    gt: { type: GqlDateTimeScalar },
    gte: { type: GqlDateTimeScalar },
    lt: { type: GqlDateTimeScalar },
    lte: { type: GqlDateTimeScalar },
    nbetween: { type: GqlFilterRangeDateTime },
    between: { type: GqlFilterRangeDateTime },
    in: { type: GqlDateTimeScalar },
    nin: { type: GqlDateTimeScalar },
    strict_left: { type: GqlFilterRangeDateTime },
    strict_right: { type: GqlFilterRangeDateTime },
  }),
});

export const GqlFilterFieldBoolean: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: 'FilterFieldDate',
  fields: () => ({
    eq: { type: GraphQLBoolean },
    neq: { type: GraphQLBoolean },
    null: { type: GqlDateTimeScalar },
  }),
});

export const GqlFilterFieldString: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: 'FilterFieldString',
  fields: () => ({
    eq: { type: GraphQLString },
    neq: { type: GraphQLString },
    null: { type: GraphQLString },
    gt: { type: GraphQLString },
    gte: { type: GraphQLString },
    lt: { type: GraphQLString },
    lte: { type: GraphQLString },
    nbetween: { type: GqlFilterRangeString },
    between: { type: GqlFilterRangeString },
    in: { type: GraphQLString },
    nin: { type: GraphQLString },
    ilike: { type: GraphQLString },
    nilike: { type: GraphQLString },
    like: { type: GraphQLString },
    nlike: { type: GraphQLString },
    substring: { type: GraphQLString },
    iregexp: { type: GraphQLString },
    niregexp: { type: GraphQLString },
    regexp: { type: GraphQLString },
    nregexp: { type: GraphQLString },
  }),
});


export enum GqlFilterFieldType {
  Number,
  String,
  Boolean,
  DateTime,
}

export type IGqlFilterAttributes = Record<string, IGqlFilterField>

export interface IGqlFilterGroup {
  attr: IGqlFilterAttributes;
  and: IGqlFilterGroup[];
  or: IGqlFilterGroup[];
}

export function GqlFilterInputFactory(arg: { name: string, fields: Record<string, GqlFilterFieldType> }): GraphQLInputObjectType {
  const name = ucFirst(arg.name);
  const { fields } = arg;

  const attributeFields = Object.fromEntries(Object.entries(fields).map(([field, type]): [string, GraphQLInputFieldConfig] => {
    switch (type) {
      case GqlFilterFieldType.Boolean: {
        const config: GraphQLInputFieldConfig = { type: GqlFilterFieldBoolean, }
        return [ field, config ];
      }
      case GqlFilterFieldType.DateTime: {
        const config: GraphQLInputFieldConfig = { type: GqlFilterFieldDateTime, }
        return [ field, config ];
      }
      case GqlFilterFieldType.Number: {
        const config: GraphQLInputFieldConfig = { type: GqlFilterFieldNumber, }
        return [ field, config ];
      }
      case GqlFilterFieldType.String: {
        const config: GraphQLInputFieldConfig = { type: GqlFilterFieldString, }
        return [ field, config ];
      }
      default: {
        throw new Error(`Unhandled filter type ${type}`);
      }
    }
  }));

  const GqlFilterAttributes: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: `${name}FilterAttributes`,
    fields: () => attributeFields,
  });

  const GqlFilterConditionGroup: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: `${name}FilterConditionGroup`,
    fields: () => ({
      attr: { type: GqlFilterAttributes },
      or: { type: GqlFilterConditionGroups },
      and: { type: GqlFilterConditionGroups },
    }),
  });
  const GqlFilterConditionGroups = GraphQLList(GraphQLNonNull(GqlFilterConditionGroup));
  return GqlFilterConditionGroup;
}

