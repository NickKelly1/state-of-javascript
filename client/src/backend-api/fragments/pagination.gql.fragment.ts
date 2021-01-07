import { gql } from "graphql-request";

/**
 * PaginationFragment Fragment
 */
export const PAGINATION_GQL_FRAGMENT = gql`
fragment Pagination on Pagination{
  limit
  offset
  total
  page_number
  pages
  more
}
`
