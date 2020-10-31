import { GqlCollectionOptionsInputFactory } from "../../../common/gql/gql.collection.options";
import { GqlFilterFieldType, } from "../../../common/gql/gql.filter.types";

const UserRoleGqlQueryFilterFields = {
  id: GqlFilterFieldType.Number,
  user_id: GqlFilterFieldType.Number,
  role_id: GqlFilterFieldType.Number,
  created_at: GqlFilterFieldType.DateTime,
  updated_at: GqlFilterFieldType.DateTime,
}

export const UserRoleCollectionOptionsGqlInput = GqlCollectionOptionsInputFactory({
  name: 'UserRole',
  filters: UserRoleGqlQueryFilterFields,
})