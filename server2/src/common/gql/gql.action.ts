import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../classes/gql.context";

export interface IGqlActionSource { can: boolean; }
export const GqlAction = new GraphQLObjectType<IGqlActionSource, GqlContext>({
  name: 'Action',
  fields: () => ({
    can: { type: GraphQLNonNull(GraphQLBoolean), },
  }),
});