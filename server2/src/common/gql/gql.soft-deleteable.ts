import { GraphQLNonNull } from "graphql";
import { GqlDateTimeScalar } from "../gql/gql.date-time";
import { deleted_at } from "../schemas/constants/deleted_at.const";

export const SoftDeleteableGql = {
  [deleted_at]: { type: GqlDateTimeScalar },
};