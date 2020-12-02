import { GraphQLNonNull } from "graphql";
import { GqlDateTimeScalar } from "./gql.date-time.scalar";
import { created_at } from "../schemas/constants/created_at.const";
import { updated_at } from "../schemas/constants/updated_at.const";

export const AuditableGql = {
  [created_at]: { type: GraphQLNonNull(GqlDateTimeScalar) },
  [updated_at]: { type: GraphQLNonNull(GqlDateTimeScalar) },
};