import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { SoftDeleteableGql } from "../../../common/gql/gql.soft-deleteable";
import { UserModel } from "../user.model";

export type IUserGqlDataSource = UserModel;
export const UserGqlData = new GraphQLObjectType<IUserGqlDataSource, GqlContext>({
  name: 'UserData',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    name: { type: GraphQLNonNull(GraphQLString), },
    ...AuditableGql,
    ...SoftDeleteableGql,
  }),
});
