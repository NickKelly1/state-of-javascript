import { GqlCollectionOptionsInputFactory } from "../../../common/gql/gql.collection.options";
import { GqlFilterFieldType } from "../../../common/gql/gql.filter.types";

const RolePermissionGqlFilterFields = {
  id: GqlFilterFieldType.Number,
  role_id: GqlFilterFieldType.Number,
  user_id: GqlFilterFieldType.Number,
  created_at: GqlFilterFieldType.DateTime,
  updated_at: GqlFilterFieldType.DateTime,
  deleted_at: GqlFilterFieldType.DateTime,
}

export const RolePermissionCollectionOptionsGqlInput = GqlCollectionOptionsInputFactory({
  name: 'RolePermission',
  filters: RolePermissionGqlFilterFields,
})