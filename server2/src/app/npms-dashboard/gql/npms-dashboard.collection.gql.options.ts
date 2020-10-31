import { GqlCollectionOptionsInputFactory } from "../../../common/gql/gql.collection.options";
import { GqlFilterFieldType } from "../../../common/gql/gql.filter.types";

const GqlNpmsDashboardFilterFields = {
  id: GqlFilterFieldType.Number,
  name: GqlFilterFieldType.String,
  created_at: GqlFilterFieldType.DateTime,
  updated_at: GqlFilterFieldType.DateTime,
  deleted_at: GqlFilterFieldType.DateTime,
}

export const NpmsDashboardCollectionOptionsGqlInput = GqlCollectionOptionsInputFactory({
  name: 'NpmsDashboard',
  filters: GqlNpmsDashboardFilterFields,
})