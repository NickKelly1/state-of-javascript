import { GraphQLList, GraphQLNonNull } from "graphql";
import { GqlCollectionOptionsInputFactory } from "../../../common/gql/gql.collection.options";
import { GqlFilterFieldType, GqlFilterInputFactory } from "../../../common/gql/gql.filter.types";

const GqlPermissionFilterFields = {
  id: GqlFilterFieldType.Number,
  name: GqlFilterFieldType.String,
  category_id: GqlFilterFieldType.Number,
  created_at: GqlFilterFieldType.DateTime,
  updated_at: GqlFilterFieldType.DateTime,
  deleted_at: GqlFilterFieldType.DateTime,
}

export const PermissionCollectionOptionsGqlInput = GqlCollectionOptionsInputFactory({
  name: 'Permission',
  filters: GqlPermissionFilterFields,
})