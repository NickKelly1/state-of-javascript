import { GraphQLList, GraphQLNonNull } from "graphql";
import { GqlCollectionOptionsInputFactory } from "../../../common/gql/gql.collection.options";
import { GqlFilterFieldType, GqlFilterInputFactory } from "../../../common/gql/gql.filter.types";

const GqlIntegrationFilterFields = {
  id: GqlFilterFieldType.Number,
  created_at: GqlFilterFieldType.DateTime,
  updated_at: GqlFilterFieldType.DateTime,
}

export const PermissionCollectionOptionsGqlInput = GqlCollectionOptionsInputFactory({
  name: 'Integration',
  filters: GqlIntegrationFilterFields,
})