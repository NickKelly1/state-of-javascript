import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLOutputType, Thunk } from "graphql";
import { unthunk } from "../helpers/unthunk.helper";
import { ICollectionMeta } from "../interfaces/collection-meta.interface";
import { GqlEdge, IGqlEdge } from "./gql.edge";
import { GqlMeta } from './gql.meta';
import { Str } from '../helpers/str.helper';

export interface IGqlConnection<T> {
  edges: T[];
  pagination: ICollectionMeta;
}

export const GqlConnection = <TSource, TContext>(arg: {
  edge: Thunk<GraphQLOutputType>;
  name: string;
}): GraphQLObjectType => new GraphQLObjectType({
  name: Str.endWith({ haystack: arg.name, needle: 'Connection' }),
  fields: () => ({
    edges: { type: GraphQLNonNull(GraphQLList(unthunk(arg.edge))) },
    meta: { type: GraphQLNonNull(GqlMeta) }
  }),
});
