import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLOutputType, Thunk } from "graphql";
import { unthunk } from "../helpers/unthunk.helper";
import { ICollectionMeta } from "../interfaces/collection-meta.interface";
import { GqlEdge, IGqlEdge } from "./gql.edge";
import { GqlMeta } from './gql.meta';
import { str } from '../helpers/str';

export interface IGqlConnection<T> {
  edges: T[];
  meta: ICollectionMeta;
}

export const GqlConnection = <TSource, TContext>(arg: {
  edge: Thunk<GraphQLOutputType>;
  name: string;
}): GraphQLObjectType => new GraphQLObjectType({
  name: str.endWith({ haystack: arg.name, needle: 'Connection' }),
  fields: () => ({
    edges: { type: GraphQLNonNull(GraphQLList(unthunk(arg.edge))) },
    meta: { type: GraphQLNonNull(GqlMeta) }
  }),
});
