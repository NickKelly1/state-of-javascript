
import { gql } from "graphql-request";

/**
 * FileData Fragment
 */
export const FILE_DATA_GQL_FRAGMENT = gql`
fragment FileData on FileData{
  id
  uploader_aid
  uploader_id
  title
  encoding
  mimetype
  filename
  is_public
  created_at
  updated_at
  deleted_at
}
`
