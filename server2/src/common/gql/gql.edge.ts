import { GraphQLFieldConfigMap, GraphQLNonNull, GraphQLObjectType, GraphQLOutputType, GraphQLString, Thunk } from "graphql";
import { Str } from "../helpers/str.helper";
import { unthunk } from "../helpers/unthunk.helper";


export interface IGqlEdge<TNode> {
  node: TNode;
  cursor: string;
}

export const GqlEdge = <TSource, TContext>(arg: {
  node: Thunk<GraphQLOutputType>;
  name: string;
}): GraphQLObjectType<TSource, TContext> => new GraphQLObjectType<TSource, TContext>({
  name: Str.endWith({ haystack: arg.name, needle: 'Edge' }),
  fields: () => ({
    node: { type: unthunk(arg.node), },
    cursor: { type: GraphQLNonNull(GraphQLString), }
  }),
});