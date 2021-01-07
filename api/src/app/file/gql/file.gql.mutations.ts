import {
  GraphQLFieldConfigMap,
  Thunk,
} from "graphql";
import { GqlContext } from "../../../common/context/gql.context";

export const FileGqlMutations: Thunk<GraphQLFieldConfigMap<undefined, GqlContext>> = () => ({
  // nothing...
});