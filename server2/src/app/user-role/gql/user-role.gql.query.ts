import { GraphQLList, GraphQLNonNull } from "graphql";
import { GqlQueryInputFactory } from "../../../common/gql/gql.query";
import { GqlFilterFieldType, GqlFilterInputFactory } from "../../../common/gql/gql.filter.types";

const GqlUserRoleFilterFields = {
  id: GqlFilterFieldType.Number,
  user_id: GqlFilterFieldType.Number,
  role_id: GqlFilterFieldType.Number,
  created_at: GqlFilterFieldType.DateTime,
  updated_at: GqlFilterFieldType.DateTime,
}

export const GqlUserRoleQuery = GqlQueryInputFactory({
  name: 'UserRole',
  filters: GqlUserRoleFilterFields,
})