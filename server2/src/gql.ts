import Dataloader from 'dataloader';
import {
  graphql,
  GraphQLField,
  GraphQLFieldConfigMap,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  Thunk,
  GraphQLArgumentConfig,
  GraphQLArgument,
  GraphQLInputObjectType,
  GraphQLUnionType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
  subscribe,
  SubscriptionArgs,
  SingleFieldSubscriptionsRule,
  isTypeSubTypeOf,
} from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import { IUserAttributes, UserField } from './app/user/user.attributes';
import { _or } from './common/schemas/api.query.types';
import { HttpContext } from './common/classes/http.context';
import { UserModel } from './app/user/user.model';
import { FindOptions, Identifier, Model, ModelCtor, Op, Sequelize, WhereOptions } from 'sequelize';
import { logger } from './common/logger/logger';
import { prettyQ } from './common/helpers/pretty.helper';
import { IPaginateInput } from './common/interfaces/pageinate-input.interface';
import { ICollectionMeta } from './common/interfaces/collection-meta.interface';
import { UserRoleModel } from './app/user-role/user-role.model';
import { UserRoleGqlConnection } from './app/user-role/gql/user-role.gql.connection';
import { IUserGqlNode, UserGqlNode } from './app/user/gql/user.gql.node';
import { IUserRoleGqlNode, UserRoleGqlNode } from './app/user-role/gql/user-role.gql.node';
import { IRoleGqlNode, RoleGqlNode } from './app/role/gql/role.gql.node';
import { RoleModel } from './app/role/role.model';
import { IRolePermissionGqlNode, RolePermissionGqlNode } from './app/role-permission/gql/role-permission.gql.node';
import { RolePermissionModel } from './app/role-permission/role-permission.model';
import { UserId } from './app/user/user.id.type';
import { GqlContext } from './common/classes/gql.context';
import { IConstructor } from './common/interfaces/constructor.interface';
import { IRequestContext } from './common/interfaces/request-context.interface';
import { OrNull } from './common/types/or-null.type';
import { QueryRunner } from './app/db/query-runner';
import { IRowsWithCount } from './common/interfaces/rows-with-count.interface';
import { OrUndefined } from './common/types/or-undefined.type';


const GqlRootQuery = new GraphQLObjectType<undefined, GqlContext>({
  name: 'RootQueryType',
  fields: () => ({
    users: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(UserGqlNode))),
      resolve: async (): Promise<IUserGqlNode[]> => {
        const { rows, count } = await UserModel.findAndCountAll({});
        return rows;
      },
    },

    userRoles: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(UserRoleGqlNode))),
      resolve: async (parent, args, ctx): Promise<IUserRoleGqlNode[]> => {
        const { rows, count } = await UserRoleModel.findAndCountAll({});
        return rows;
      },
    },

    roles: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(RoleGqlNode))),
      resolve: async (): Promise<IRoleGqlNode[]> => {
        const { rows, count } = await RoleModel.findAndCountAll({});
        return rows;
      },
    },

    rolePermissions: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(RolePermissionGqlNode))),
      resolve: async (): Promise<IRolePermissionGqlNode[]> => {
        const { rows, count } = await RolePermissionModel.findAndCountAll({});
        return rows;
      },
    },
  }),
});

export const gqlSchema = new GraphQLSchema({
  // subscription: sub,
  query: GqlRootQuery,
});


// export async function testGql(arg: { sequelize: Sequelize }) {
//   logger.debug('gql testing...');
//   const query = /* GraphQL */ `{
//     users {
//         id
//         name
//       }
//   }`;
//   const result = await graphql(gqlSchema, query);
//   logger.debug(`gql test result: ${prettyQ(result)}`)
// }

// // graphqlHTTP()(req, res)


// const sub = new GraphQLObjectType({

// });

// const t = subscribe({ schema: gqlSchema, document });
