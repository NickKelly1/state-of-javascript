import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { Op } from "sequelize";
import { UserField } from "../../user/user.attributes";
import { UserModel } from "../../../circle";
import { RolePermissionGqlConnection } from "./role-permission.gql.connection";
import { IUserGqlConnection, UserGqlConnection } from "../../user/gql/user.gql.connection";
import { IPaginateInput } from "../../../common/interfaces/pageinate-input.interface";
import { collectionMeta } from "../../../common/responses/collection-meta";
import { GqlContext } from "../../../common/classes/gql.context";
import { RolePermissionModel } from "../role-permission.model";
import { RoleModel } from "../../role/role.model";
import { IRoleGqlConnection, RoleGqlConnection } from "../../role/gql/role.gql.connection";
import { RoleField } from "../../role/role.attributes";
import { IRoleGqlEdge, RoleGqlEdge } from "../../role/gql/role.gql.edge";
import { connectionGqlArg } from "../../../common/gql/gql.connection.input";
import { transformGqlCollectionInput } from "../../../common/gql/gql.collection.transform";
import { IPermissionGqlConnection, PermissionGqlConnection } from "../../permission/gql/permission.gql.connection";
import { PermissionModel } from "../../permission/permission.model";
import { IPermissionGqlEdge, PermissionGqlEdge } from "../../permission/gql/permission.gql.edge";
import { PermissionField } from "../../permission/permission.attributes";
import { IUserRoleGqlEdge } from "../../user-role/gql/user-role.gql.edge";
import { IRolePermissionGqlEdge } from "./role-permission.gql.edge";


export type IRolePermissionGqlNode = RolePermissionModel;
export const RolePermissionGqlNode: GraphQLObjectType<RolePermissionModel, GqlContext> = new GraphQLObjectType<RolePermissionModel, GqlContext>({
  name: 'RolePermission',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), },
    role_id: { type: GraphQLNonNull(GraphQLInt), },
    permission_id: { type: GraphQLNonNull(GraphQLInt), },

    role: {
      type: GraphQLNonNull(RoleGqlEdge),
      resolve: async (parent, args, ctx): Promise<IRoleGqlEdge> => {
        const model = await ctx.loader.roles.load(parent.role_id);
        const edge: IRoleGqlEdge = { node: model, cursor: model.id.toString(), };
        return edge;
      },
    },

    permission: {
      type: GraphQLNonNull(PermissionGqlEdge),
      resolve: async (parent, args, ctx): Promise<IPermissionGqlEdge> => {
        const model = await ctx.loader.permissions.load(parent.permission_id);
        const edge: IPermissionGqlEdge = { node: model, cursor: model.id.toString(), };
        return edge;
      },
    },
  }),
});
