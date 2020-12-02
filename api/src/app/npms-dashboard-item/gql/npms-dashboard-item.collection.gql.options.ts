import { GqlCollectionOptionsInputFactory } from "../../../common/gql/gql.collection.options";
import { GqlFilterFieldType } from "../../../common/gql/gql.filter.types";

const GqlNpmsDashboardItemFilterFields = {
  id: GqlFilterFieldType.Number,
  dashboard_id: GqlFilterFieldType.Number,
  npms_id: GqlFilterFieldType.Number,
  created_at: GqlFilterFieldType.DateTime,
  updated_at: GqlFilterFieldType.DateTime,
  deleted_at: GqlFilterFieldType.DateTime,
}

export const NpmsDashboardItemCollectionOptionsGqlInput = GqlCollectionOptionsInputFactory({
  name: 'NpmsDashboardItem',
  filters: GqlNpmsDashboardItemFilterFields,
})