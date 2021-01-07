import { GqlCollectionOptionsInputFactory } from "../../../common/gql/gql.collection.options";
import { GqlFilterFieldType } from "../../../common/gql/gql.filter.types";
import { ImageField } from "../image.attributes";

const GqlImageFilterFields = {
  [ImageField.id]: GqlFilterFieldType.Number,
  [ImageField.original_id]: GqlFilterFieldType.Number,
  [ImageField.thumbnail_id]: GqlFilterFieldType.Number,
  [ImageField.display_id]: GqlFilterFieldType.Number,
  [ImageField.title]: GqlFilterFieldType.String,
  [ImageField.created_at]: GqlFilterFieldType.DateTime,
  [ImageField.updated_at]: GqlFilterFieldType.DateTime,
  [ImageField.deleted_at]: GqlFilterFieldType.DateTime,
}

export const ImageCollectionOptionsGqlInput = GqlCollectionOptionsInputFactory({
  name: 'Image',
  filters: GqlImageFilterFields,
});
