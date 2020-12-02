import { GraphQLList, GraphQLNonNull } from "graphql";
import { GqlCollectionOptionsInputFactory } from "../../../common/gql/gql.collection.options";
import { GqlFilterFieldType, GqlFilterInputFactory } from "../../../common/gql/gql.filter.types";

const GqlPermissionCategoryFilterFields = {
  id: GqlFilterFieldType.Number,
  name: GqlFilterFieldType.String,
  colour: GqlFilterFieldType.String,
  created_at: GqlFilterFieldType.DateTime,
  updated_at: GqlFilterFieldType.DateTime,
  deleted_at: GqlFilterFieldType.DateTime,
}

export const PermissionCategoryCollectionOptionsGqlInput = GqlCollectionOptionsInputFactory({
  name: 'permissionCategory',
  filters: GqlPermissionCategoryFilterFields,
})