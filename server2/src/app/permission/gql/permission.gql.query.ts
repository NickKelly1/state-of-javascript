import { GraphQLFieldConfigMap, GraphQLNonNull, Thunk } from "graphql";
import { NewsArticleModel } from "../../../circle";
import { GqlContext } from "../../../common/context/gql.context";
import { gqlQueryArg } from "../../../common/gql/gql.query.arg";
import { transformGqlQuery } from "../../../common/gql/gql.query.transform";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { OrNull } from "../../../common/types/or-null.type";

export const PermissionGqlQuery: Thunk<GraphQLFieldConfigMap<unknown, GqlContext>> = () => ({
  //
});