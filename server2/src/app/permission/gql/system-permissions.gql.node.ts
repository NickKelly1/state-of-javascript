import { GraphQLObjectType, GraphQLNonNull, GraphQLList } from "graphql";
import { ISystemPermissionValue } from "../../../common/classes/system-permissions";
import { GqlContext } from "../../../common/context/gql.context";
import { OrNull } from "../../../common/types/or-null.type";
import { PermissionGqlNode, IPermissionGqlNodeSource } from "./permission.gql.node";

export type ISystemPermissionGqlNodeSource = ISystemPermissionValue;
export const SystemPermissionGqlNode = new GraphQLObjectType<ISystemPermissionValue, GqlContext>({
  name: 'SystemPermissionGqlNode',
  fields: () => ({
    pub: {
      type: GraphQLNonNull(GraphQLList(PermissionGqlNode)),
      resolve: (parent, args, ctx): OrNull<IPermissionGqlNodeSource>[] => {
        const final = parent.pub.map(permission => {
          if (ctx.services.permissionPolicy.canFindOne({ model: permission })) return permission;
          return null;
        });
        return final;
      },
    },
    authenticated: {
      type: GraphQLNonNull(GraphQLList(PermissionGqlNode)),
      resolve: (parent, args, ctx): OrNull<IPermissionGqlNodeSource>[] => {
        const final = parent.authenticated.map(permission => {
          if (ctx.services.permissionPolicy.canFindOne({ model: permission })) return permission;
          return null;
        });
        return final;
      },
    },
  })
})