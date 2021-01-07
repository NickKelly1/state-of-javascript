import { GqlCollectionOptionsInputFactory } from "../../../common/gql/gql.collection.options";
import { GqlFilterFieldType } from "../../../common/gql/gql.filter.types";
import { FileField } from "../file.attributes";

const GqlFileFilterFields = {
  [FileField.id]: GqlFilterFieldType.Number,
  [FileField.uploader_id]: GqlFilterFieldType.Number,
  [FileField.uploader_aid]: GqlFilterFieldType.String,
  [FileField.title]: GqlFilterFieldType.String,
  [FileField.encoding]: GqlFilterFieldType.String,
  [FileField.mimetype]: GqlFilterFieldType.String,
  [FileField.is_public]: GqlFilterFieldType.Boolean,
  [FileField.created_at]: GqlFilterFieldType.DateTime,
  [FileField.updated_at]: GqlFilterFieldType.DateTime,
  [FileField.deleted_at]: GqlFilterFieldType.DateTime,
}

export const FileCollectionOptionsGqlInput = GqlCollectionOptionsInputFactory({
  name: 'File',
  filters: GqlFileFilterFields,
});
