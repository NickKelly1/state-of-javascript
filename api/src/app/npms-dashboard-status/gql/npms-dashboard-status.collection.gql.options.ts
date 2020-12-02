import { GqlCollectionOptionsInputFactory } from "../../../common/gql/gql.collection.options";
import { GqlFilterFieldType } from "../../../common/gql/gql.filter.types";

const GqlNpmsDashboardStatusFilterFields = {
  id: GqlFilterFieldType.Number,
  name: GqlFilterFieldType.String,
  created_at: GqlFilterFieldType.DateTime,
  updated_at: GqlFilterFieldType.DateTime,
  deleted_at: GqlFilterFieldType.DateTime,
}

export const NpmsDashboardStatusCollectionOptionsGqlInput = GqlCollectionOptionsInputFactory({
  name: 'NpmsDashboardStatus',
  filters: GqlNpmsDashboardStatusFilterFields,
})