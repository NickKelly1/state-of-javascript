import { GqlQueryInputFactory } from "../../../common/gql/gql.query";
import { GqlFilterFieldType, } from "../../../common/gql/gql.filter.types";

const UserRoleGqlQueryFilterFields = {
  id: GqlFilterFieldType.Number,
  user_id: GqlFilterFieldType.Number,
  role_id: GqlFilterFieldType.Number,
  created_at: GqlFilterFieldType.DateTime,
  updated_at: GqlFilterFieldType.DateTime,
}

export const UserRoleGqlQuery = GqlQueryInputFactory({
  name: 'UserRole',
  filters: UserRoleGqlQueryFilterFields,
})