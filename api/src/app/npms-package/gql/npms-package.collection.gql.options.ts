import { GqlCollectionOptionsInputFactory } from "../../../common/gql/gql.collection.options";
import { GqlFilterFieldType } from "../../../common/gql/gql.filter.types";

const GqlNpmsPackageFilterFields = {
  id: GqlFilterFieldType.Number,
  name: GqlFilterFieldType.String,
  last_ran_at: GqlFilterFieldType.DateTime,
  created_at: GqlFilterFieldType.DateTime,
  updated_at: GqlFilterFieldType.DateTime,
  deleted_at: GqlFilterFieldType.DateTime,
}

export const NpmsPackageCollectionOptionsGqlInput = GqlCollectionOptionsInputFactory({
  name: 'NpmsPackage',
  filters: GqlNpmsPackageFilterFields,
})