import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { AuditableGql } from "../../../common/gql/gql.auditable";
import { SoftDeleteableGql } from "../../../common/gql/gql.soft-deleteable";
import { OrNull } from "../../../common/types/or-null.type";
import { UserField } from "../user.attributes";
import { UserModel } from "../user.model";

export type IUserGqlDataSource = UserModel;
export const UserGqlData = new GraphQLObjectType<IUserGqlDataSource, GqlContext>({
  name: 'UserData',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), resolve: (parent): number => parent[UserField.id], },
    name: { type: GraphQLNonNull(GraphQLString), resolve: (parent): string => parent[UserField.name], },
    email: {
      type: GraphQLString,
      resolve: (parent, args, ctx): OrNull<string> => {
        if (!ctx.services.userPolicy.canShowIdentity({ model: parent })) return null;
        return parent.email;
      },
    },
    deactivated: { type: GraphQLNonNull(GraphQLBoolean), resolve: (parent): boolean => parent[UserField.deactivated], },
    verified: { type: GraphQLNonNull(GraphQLBoolean), resolve: (parent): boolean => parent[UserField.verified], },
    ...AuditableGql,
    ...SoftDeleteableGql,
  }),
});
