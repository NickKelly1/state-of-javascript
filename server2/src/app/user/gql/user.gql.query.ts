import { GqlQueryInputFactory } from "../../../common/gql/gql.query";
import { GqlFilterFieldType } from "../../../common/gql/gql.filter.types";

const GqlUserFilterFields = {
  id: GqlFilterFieldType.Number,
  name: GqlFilterFieldType.String,
  created_at: GqlFilterFieldType.DateTime,
  updated_at: GqlFilterFieldType.DateTime,
  deleted_at: GqlFilterFieldType.DateTime,
}

export const GqlUserQuery = GqlQueryInputFactory({
  name: 'User',
  filters: GqlUserFilterFields,
})