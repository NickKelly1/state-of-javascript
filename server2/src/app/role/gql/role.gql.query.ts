import { GraphQLList, GraphQLNonNull } from "graphql";
import { GqlQueryInputFactory } from "../../../common/gql/gql.query";
import { GqlFilterFieldType, GqlFilterInputFactory } from "../../../common/gql/gql.filter.types";

const GqlRoleFilterFields = {
  id: GqlFilterFieldType.Number,
  name: GqlFilterFieldType.String,
  created_at: GqlFilterFieldType.DateTime,
  updated_at: GqlFilterFieldType.DateTime,
  deleted_at: GqlFilterFieldType.DateTime,
}

export const GqlRoleQuery = GqlQueryInputFactory({
  name: 'Role',
  filters: GqlRoleFilterFields,
})