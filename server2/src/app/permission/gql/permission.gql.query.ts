import { GraphQLList, GraphQLNonNull } from "graphql";
import { GqlQueryInputFactory } from "../../../common/gql/gql.query";
import { GqlFilterFieldType, GqlFilterInputFactory } from "../../../common/gql/gql.filter.types";

const GqlPermissionFilterFields = {
  id: GqlFilterFieldType.Number,
  role_id: GqlFilterFieldType.Number,
  permission_id: GqlFilterFieldType.Number,
  created_at: GqlFilterFieldType.DateTime,
  updated_at: GqlFilterFieldType.DateTime,
}

export const GqlPermissionQuery = GqlQueryInputFactory({
  name: 'Permission',
  filters: GqlPermissionFilterFields,
})