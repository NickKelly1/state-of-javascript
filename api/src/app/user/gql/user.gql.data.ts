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
import { UserModel } from "../user.model";

export type IUserGqlDataSource = UserModel;
export const UserGqlData = new GraphQLObjectType<IUserGqlDataSource, GqlContext>({
  name: 'UserData',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    name: { type: GraphQLNonNull(GraphQLString), },
    deactivated: { type: GraphQLNonNull(GraphQLBoolean), },
    email: {
      type: GraphQLString,
      resolve: (parent, args, ctx): OrNull<string> => {
        if (!ctx.services.userPolicy.canShowIdentity({ model: parent })) return null;
        return parent.email;
      },
    },
    verified: { type: GraphQLNonNull(GraphQLBoolean), },
    // verified: {
    //   type: GraphQLBoolean,
    //   resolve: (parent, args, ctx): OrNull<boolean> => {
    //     if (!ctx.services.userPolicy.canShowIdentity({ model: parent })) return null;
    //     return parent.verified;
    //   },
    // },
    ...AuditableGql,
    ...SoftDeleteableGql,
  }),
});
