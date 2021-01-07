
import { gql } from "graphql-request";

/**
 * ImageData Fragment
 */
export const IMAGE_DATA_GQL_FRAGMENT = gql`
fragment ImageData on ImageData{
  id
  fsid
  title
  thumbnail_id
  original_id
  display_id
  created_at
  updated_at
  deleted_at
}

`
